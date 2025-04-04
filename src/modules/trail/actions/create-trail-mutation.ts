'use server';

import { validateRequest } from '@/modules/auth/services/next';
import { isAdminOrAbove, isAuthenticated } from '@/modules/auth/utils/is';
import { type NewTrailTable } from '@/modules/database/schema/trail';
import { log } from '@/modules/logging/lib/pino';
import { fail, ok, type Result } from '@/shared/lib/result';
import { revalidateTrails } from '../lib/revalidate-trail';
import { TrailRepository } from '../repositories/trail-repository';
import { newTrailSchema, type NewTrailSchema } from '../schemas/new-trail-schema';

export async function createTrailMutation(params: NewTrailSchema): Promise<Result<number>> {
  const { data: user } = await validateRequest();

  if (!isAuthenticated(user)) {
    return fail('Você precisa estar logado para criar uma trilha.');
  }

  if (!isAdminOrAbove(user.role)) {
    return fail('Somente administradores podem criar trilhas.');
  }

  const validatedParams = newTrailSchema.safeParse(params);

  if (!validatedParams.success) {
    return fail('Parâmetros inválidos para criar nova trilha.');
  }

  const trailRepository = new TrailRepository();

  const newTrail: NewTrailTable = {
    title: validatedParams.data.title,
    description: validatedParams.data.description,
    thumbnail: validatedParams.data.thumbnail,
    status: validatedParams.data.status,
    authorId: user.id,
    category: validatedParams.data.category,
  };

  try {
    const trail = await trailRepository.createTrail(newTrail);
    log.info('Trilha criada', { trailId: trail, authorId: user.id });
    revalidateTrails({ username: user.username });
    return ok(trail);
  } catch (error) {
    log.error('Falha ao criar trilha', String(error), { newTrail });
    return fail('Falha ao criar trilha');
  }
}
