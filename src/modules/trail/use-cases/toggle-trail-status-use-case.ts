import type { Session } from '@/modules/auth/types/session';
import { isAdminOrAbove } from '@/modules/auth/utils/is';
import { DrizzleTrailRepository } from '../repositories/trail-repository';
import { trailWithIdSchema, type TrailWithIdSchema } from '../schemas/trail-with-id-schema';

export async function toggleTrailStatusUseCase(params: TrailWithIdSchema, session: Session) {
  if (!isAdminOrAbove(session.user.role)) {
    throw new Error('Somente administradores podem editar trilhas.');
  }

  const validatedParams = trailWithIdSchema.safeParse(params);

  if (!validatedParams.success) {
    throw new Error('Parâmetros inválidos');
  }

  const repository = new DrizzleTrailRepository();

  const trail = await repository.getTrailById(validatedParams.data.id);

  if (trail.status === 'PUBLISHED') {
    return repository.omitTrail(validatedParams.data.id);
  }

  if (trail.status === 'DRAFT') {
    return repository.enableTrail(validatedParams.data.id);
  }

  throw new Error('Status inválido');
}
