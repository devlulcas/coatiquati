'use server';

import {
  assertAuthenticated,
  getCurrentUser,
} from '@/modules/auth/services/next';
import { db } from '@/modules/database/db';
import { user as userTable } from '@/modules/database/schema/auth';
import { fail, ok, type Result } from '@/shared/lib/result';
import { eq } from 'drizzle-orm';
import { DEFAULT_AVATAR } from '../constants/avatars';
import {
  type UpdateUserSchema,
  updateUserSchema,
} from '../schemas/update-user-schema';

export async function updateUserMutation(
  params: UpdateUserSchema
): Promise<Result<string>> {
  const user = await getCurrentUser();
  assertAuthenticated(user);

  const parsed = updateUserSchema.safeParse(params);

  if (!parsed.success) {
    return fail(parsed.error.message);
  }

  try {
    await db
      .update(userTable)
      .set({
        name: parsed.data.name ?? user.name,
        image: parsed.data.avatar ?? user.image ?? DEFAULT_AVATAR,
      })
      .where(eq(userTable.id, user.id));

    return ok('Usuário atualizado com sucesso');
  } catch (error) {
    console.error(error);
    return fail('Erro ao atualizar usuário');
  }
}
