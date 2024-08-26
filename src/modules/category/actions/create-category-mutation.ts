'use server';

import { isAdminOrAbove, isAuthenticated } from '@/modules/auth/utils/is';
import { log } from '@/modules/logging/lib/pino';
import { fail, ok, type Result } from '@/shared/lib/result';
import { TrailCategoryRepository } from '../repositories/trail-category-repository';
import { newTrailCategorySchema } from '../schemas/new-trail-category-schema';

export async function createCategoryMutation(name: string): Promise<Result<string>> {
  const { user } = await validateRequest();

  if (!isAuthenticated(session)) {
    return fail('Falha ao criar categoria. Você precisa estar logado para criar uma categoria.');
  }

  if (!isAdminOrAbove(session.user.role)) {
    return fail('Falha ao criar categoria. Você precisa ser um administrador para criar uma categoria.');
  }

  const validatedParams = newTrailCategorySchema.safeParse({ name, authorId: session.user.userId });

  if (!validatedParams.success) {
    return fail('Falha ao criar categoria.');
  }

  const trailCategoryRepository = new TrailCategoryRepository();

  try {
    await trailCategoryRepository.upsertCategory(validatedParams.data);
    return ok('Categoria criada com sucesso.');
  } catch (error) {
    log.error('Erro ao criar categoria.', { name, userId: session.user.userId, error });
    return fail('Erro ao criar categoria.');
  }
}
