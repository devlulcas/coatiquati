'use server';

import { validateRequest } from '@/modules/auth/services/lucia';
import { isAdminOrAbove, isAuthenticated } from '@/modules/auth/utils/is';
import { db } from '@/modules/database/db';
import { categoryTable } from '@/modules/database/schema/category';
import { log } from '@/modules/logging/lib/pino';
import { fail, ok, type Result } from '@/shared/lib/result';
import { newTrailCategorySchema } from '../schemas/new-trail-category-schema';

export async function createCategoryMutation(name: string): Promise<Result<string>> {
  const { user } = await validateRequest();

  if (!isAuthenticated(user)) {
    return fail('Falha ao criar categoria. Você precisa estar logado para criar uma categoria.');
  }

  if (!isAdminOrAbove(user.role)) {
    return fail('Falha ao criar categoria. Você precisa ser um administrador para criar uma categoria.');
  }

  const validatedParams = newTrailCategorySchema.safeParse({ name, authorId: user.id });

  if (!validatedParams.success) {
    return fail('Falha ao criar categoria.');
  }

  try {
    const category = validatedParams.data;

    await db
      .insert(categoryTable)
      .values({ name: category.name, authorId: category.authorId })
      .onConflictDoNothing()
      .execute();

    return ok('Categoria criada com sucesso.');
  } catch (error) {
    log.error('Erro ao criar categoria.', { name, userId: user.id, error });
    return fail('Erro ao criar categoria.');
  }
}
