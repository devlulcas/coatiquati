'use server';

import { getActionSession } from '@/modules/auth/utils/get-action-session';
import { isAdminOrAbove, isAuthenticated } from '@/modules/auth/utils/is';
import { log } from '@/modules/logging/lib/pino';
import { revalidateTrails } from '../lib/revalidate-trail';
import { TrailRepository } from '../repositories/trail-repository';
import { updateTrailSchema, type UpdateTrailSchema } from '../schemas/edit-trail-schema';
import type { UpdateTrail } from '../types/trail';

export async function updateTrailMutation(params: UpdateTrailSchema) {
  const session = await getActionSession();

  if (!isAuthenticated(session)) {
    throw new Error('Você precisa estar logado para editar uma trilha.');
  }

  if (!isAdminOrAbove(session.user.role)) {
    throw new Error('Somente administradores podem editar trilhas. Entre como administrador.');
  }

  const validatedParams = updateTrailSchema.safeParse(params);

  if (!validatedParams.success) {
    throw new Error('Parâmetros inválidos para editar trilha.');
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

  const trail = await trailRepository.updateTrail(updatedTrail);

  log.info('Trilha atualizada', { trailId: trail, contributorId: session.user.id });

  revalidateTrails({ username: session.user.username });

  return trail;
}
