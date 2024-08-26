'use server';

import { validateRequest } from '@/modules/auth/services/lucia';
import { isAdminOrAbove } from '@/modules/auth/utils/is';
import { db } from '@/modules/database/db';
import { userTable } from '@/modules/database/schema/user';
import { log } from '@/modules/logging/lib/pino';
import { fail, isFail, ok, wrapAsyncInResult, type Result } from '@/shared/lib/result';
import { eq } from 'drizzle-orm';

export async function unbanUserMutation(params: { username: string }): Promise<Result<string>> {
  const { user } = await validateRequest();

  if (user === null) {
    return fail('Você não está autenticado');
  }

  if (!isAdminOrAbove(user.role)) {
    return fail('Você não tem permissão para remover ban de usuários');
  }

  if (!params.username) {
    return fail('Nome do usuário é obrigatório');
  }

  if (user.username === params.username) {
    return fail('Você não pode remover o ban de si mesmo');
  }

  const userResult = await wrapAsyncInResult(
    db.query.userTable.findFirst({
      columns: { id: true, bannedAt: true },
      where: (fields, op) => op.eq(fields.username, params.username),
    }),
  );

  if (isFail(userResult) || !userResult.value) {
    return fail('Erro ao buscar usuário');
  }

  try {
    await db.update(userTable).set({ bannedAt: null }).where(eq(userTable.id, user.id)).execute();
    log.info(`Banimento removido: ${user.id} por ${user.id}`);
    return ok('Banimento removido com sucesso');
  } catch (error) {
    log.error('Erro ao remover banimento', { error });
    return fail('Erro ao remover banimento');
  }
}
