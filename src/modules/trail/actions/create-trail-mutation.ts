'use server';

import { getActionSession } from '@/modules/auth/utils/get-action-session';
import { isAdminOrAbove, isAuthenticated } from '@/modules/auth/utils/is';
import { type NewTrailTable } from '@/modules/database/schema/trail';
import { log } from '@/modules/logging/lib/pino';
import { revalidateTrails } from '../lib/revalidate-trail';
import { TrailRepository } from '../repositories/trail-repository';
import { newTrailSchema, type NewTrailSchema } from '../schemas/new-trail-schema';

export async function createTrailMutation(params: NewTrailSchema) {
  const session = await getActionSession();

  if (!isAuthenticated(session)) {
    throw new Error('Você precisa estar logado para criar uma trilha.');
  }

  if (!isAdminOrAbove(session.user.role)) {
    throw new Error('Somente administradores podem criar trilhas.');
  }

  const validatedParams = newTrailSchema.safeParse(params);

  if (!validatedParams.success) {
    throw new Error('Parâmetros inválidos para criar nova trilha.');
  }

  const trailRepository = new TrailRepository();

  const newTrail: NewTrailTable = {
    title: validatedParams.data.title,
    description: validatedParams.data.description,
    thumbnail: validatedParams.data.thumbnail,
    status: validatedParams.data.status,
    authorId: session.user.id,
    category: validatedParams.data.category,
  };

  const trail = await trailRepository.createTrail(newTrail);

  log.info('Trilha criada', { trailId: trail, authorId: session.user.id });

  revalidateTrails({ username: session.user.username });

  return trail;
}
