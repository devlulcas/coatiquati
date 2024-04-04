'use server';

import { getActionSession } from '@/modules/auth/utils/get-action-session';
import { isAdminOrAbove, isAuthenticated } from '@/modules/auth/utils/is';
import { revalidateTrails } from '../lib/revalidate-trail';
import { TrailRepository } from '../repositories/trail-repository';
import { trailWithIdSchema, type TrailWithIdSchema } from '../schemas/trail-with-id-schema';

export async function toggleTrailStatusMutation(params: TrailWithIdSchema): Promise<void> {
  const session = await getActionSession();

  if (!isAuthenticated(session)) {
    throw new Error('Usuário não autenticado.');
  }

  if (!isAdminOrAbove(session.user.role)) {
    throw new Error('Somente administradores podem editar trilhas.');
  }

  const validatedParams = trailWithIdSchema.safeParse(params);

  if (!validatedParams.success) {
    throw new Error('Parâmetros inválidos para editar trilha.');
  }

  const trailRepository = new TrailRepository();

  const trail = await trailRepository.getTrailById(validatedParams.data.id);

  if (trail.status === 'PUBLISHED') {
    trailRepository.omitTrail(validatedParams.data.id);
  } else if (trail.status === 'DRAFT') {
    trailRepository.enableTrail(validatedParams.data.id);
  } else {
    throw new Error('Status inválido para trilha.');
  }

  revalidateTrails({ username: session.user.username, trailId: trail.id });
}
