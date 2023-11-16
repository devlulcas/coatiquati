import type { Session } from '@/modules/auth/types/session';
import { isAdminOrAbove } from '@/modules/auth/utils/is';
import { type NewTrailTable } from '@/modules/database/schema/trail';
import { TrailRepository } from '../repositories/trail-repository';
import { newTrailSchema, type NewTrailSchema } from '../schemas/new-trail-schema';

export async function createNewTrailUseCase(params: NewTrailSchema, session: Session) {
  if (!isAdminOrAbove(session.user.role)) {
    throw new Error('Somente administradores podem criar trilhas.');
  }

  const validatedParams = newTrailSchema.safeParse(params);

  if (!validatedParams.success) {
    throw new Error('Parâmetros inválidos');
  }

  const repository = new TrailRepository();

  const newTrail: NewTrailTable = {
    title: validatedParams.data.title,
    description: validatedParams.data.description,
    thumbnail: validatedParams.data.thumbnail,
    status: validatedParams.data.status,
    authorId: session.user.id,
    category: validatedParams.data.categoryId,
  };

  return repository.createTrail(newTrail);
}
