'use server';

import { getActionSession } from '@/modules/auth/utils/get-action-session';
import { isAdminOrAbove, isAuthenticated } from '@/modules/auth/utils/is';
import { log } from '@/modules/logging/lib/pino';
import { fail, ok, wrapAsyncInResult, type Result } from '@/shared/lib/result';
import { revalidateTrails } from '../lib/revalidate-trail';
import { TrailRepository } from '../repositories/trail-repository';
import { updateTrailSchema, type UpdateTrailSchema } from '../schemas/edit-trail-schema';
import type { UpdateTrail } from '../types/trail';

export async function updateTrailMutation(params: UpdateTrailSchema): Promise<Result<string>> {
  const session = await getActionSession();

  if (!isAuthenticated(session)) {
    return fail('Você precisa estar logado para editar uma trilha.');
  }

  if (!isAdminOrAbove(session.user.role)) {
    return fail('Somente administradores podem editar trilhas. Entre como administrador.');
  }

  const validatedParams = updateTrailSchema.safeParse(params);

  if (!validatedParams.success) {
    return fail('Parâmetros inválidos para editar trilha.');
  }

  const updatedTrail: UpdateTrail = {
    id: validatedParams.data.id,
    title: validatedParams.data.title,
    description: validatedParams.data.description,
    thumbnail: validatedParams.data.thumbnail,
    status: validatedParams.data.status,
    contributorId: session.user.id,
    category: validatedParams.data.category,
  };

  const trailRepository = new TrailRepository();

  const trailResult = await wrapAsyncInResult(trailRepository.updateTrail(updatedTrail));

  if (trailResult.type === 'fail') {
    return fail('Falha ao editar trilha.');
  }

  log.info('Trilha atualizada', { trailId: validatedParams.data.id, contributorId: session.user.id });

  revalidateTrails({ username: session.user.username });

  return ok('Trilha atualizada com sucesso.');
}
