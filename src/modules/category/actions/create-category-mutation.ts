'use server';

import { auth } from '@/modules/auth/lib/auth';
import {
  assertAuthenticated,
  getCurrentUser,
} from '@/modules/auth/services/next';
import { db } from '@/modules/database/db';
import {
  categories,
  type InsertCategory,
} from '@/modules/database/schema/category';
import { fail, ok } from '@/shared/lib/result';

export async function createCategoryMutation(params: InsertCategory) {
  const user = await getCurrentUser();
  assertAuthenticated(user);

  const data = await auth.api.userHasPermission({
    body: {
      userId: user.id,
      permission: { category: ['create'] },
    },
  });

  if (data.error || !data.success) {
    return fail(
      'Falha ao criar categoria. Você não tem permissão para criar uma categoria.'
    );
  }

  try {
    const category = await db
      .insert(categories)
      .values(params)
      .onConflictDoUpdate({ target: [categories.name], set: params })
      .returning()
      .then((result) => result.at(0));

    if (!category) {
      return fail('Erro ao criar categoria.');
    }

    return ok(category);
  } catch (error) {
    console.error(error);
    return fail('Erro ao criar categoria.');
  }
}
