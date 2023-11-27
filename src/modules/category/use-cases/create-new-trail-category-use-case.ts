import type { Session } from '@/modules/auth/types/session';
import { isAdminOrAbove } from '@/modules/auth/utils/is';
import { TrailCategoryRepository } from '../repositories/trail-category-repository';
import { newTrailCategorySchema } from '../schemas/new-trail-category-schema';

export class CreateNewTrailCategoryUseCase {
  constructor(private readonly trailCategoryRepository: TrailCategoryRepository = new TrailCategoryRepository()) {}

  async execute(params: { name: string }, session: Session) {
    const user = session.user;

    if (!isAdminOrAbove(user.role)) {
      throw new Error('Falha ao criar categoria. Você precisa ser um administrador para criar uma categoria.');
    }

    const validatedParams = newTrailCategorySchema.safeParse({ ...params, authorId: user.userId });

    if (!validatedParams.success) {
      throw new Error('Falha ao criar categoria.');
    }

    return this.trailCategoryRepository.upsertCategory(validatedParams.data);
  }
}
