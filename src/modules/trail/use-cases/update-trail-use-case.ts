import type { Session } from '@/modules/auth/types/session';
import { isAdminOrAbove } from '@/modules/auth/utils/is';
import { DrizzleTrailRepository } from '../repositories/trail-repository';
import { updateTrailSchema, type UpdateTrailSchema } from '../schemas/edit-trail-schema';
import type { UpdateTrail } from '../types/trail';

export async function updateTrailUseCase(params: UpdateTrailSchema, session: Session) {
  if (!isAdminOrAbove(session.user.role)) {
    throw new Error('Somente administradores podem editar trilhas.');
  }

  const validatedParams = updateTrailSchema.safeParse(params);

  if (!validatedParams.success) {
    throw new Error('Parâmetros inválidos');
  }

  const repository = new DrizzleTrailRepository();

  const updatedTrail: UpdateTrail = {
    id: validatedParams.data.id,
    title: validatedParams.data.title,
    description: validatedParams.data.description,
    thumbnail: validatedParams.data.thumbnail,
    status: validatedParams.data.status,
    contributorId: session.user.id,
    category: validatedParams.data.categoryId,
  };

  return repository.updateTrail(updatedTrail);
}
