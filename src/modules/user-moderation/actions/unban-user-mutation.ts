'use server';

import { auth } from '@/modules/auth/lib/auth';
import {
  assertAuthenticated,
  getCurrentUser,
} from '@/modules/auth/services/next';
import { db } from '@/modules/database/db';
import { fail, ok, type Result } from '@/shared/lib/result';

export async function unbanUserMutation(
  userId: string
): Promise<Result<string>> {
  const currentUser = await getCurrentUser();
  assertAuthenticated(currentUser);

  const can = await auth.api.userHasPermission({
    body: {
      userId: currentUser.id,
      permission: {
        user: ['ban'],
      },
    },
  });

  if (!can.success) {
    return fail('Você não tem permissão para remover ban de usuários');
  }

  const bannedUser = await db.query.user.findFirst({
    where: (fields, operators) => {
      return operators.and(
        operators.eq(fields.id, userId),
        operators.eq(fields.banned, true)
      );
    },
  });

  if (!bannedUser) {
    return fail('Usuário não encontrado ou não banido');
  }

  try {
    await auth.api.unbanUser({
      body: {
        userId,
      },
    });

    return ok('Banimento removido com sucesso');
  } catch (error) {
    console.error(error);
    return fail('Erro ao remover banimento');
  }
}
