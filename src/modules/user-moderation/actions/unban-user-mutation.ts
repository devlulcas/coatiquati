'use server';

import { getActionSession } from '@/modules/auth/utils/get-action-session';
import { isAdminOrAbove } from '@/modules/auth/utils/is';
import { db } from '@/modules/database/db';
import { userTable } from '@/modules/database/schema/user';
import { log } from '@/modules/logging/lib/pino';
import { fail, ok, wrapAsyncInResult, type Result } from '@/shared/lib/result';
import { eq } from 'drizzle-orm';

export async function unbanUserMutation(params: { username: string }): Promise<Result<string>> {
  const session = await getActionSession();

  if (session === null) {
    return fail('Você não está autenticado');
  }

  if (!isAdminOrAbove(session.user.role)) {
    return fail('Você não tem permissão para remover ban de usuários');
  }

  if (!params.username) {
    return fail('Nome do usuário é obrigatório');
  }

  const userResult = await wrapAsyncInResult(
    db.query.userTable.findFirst({
      columns: { id: true, isBanned: true },
      where: (fields, op) => op.eq(fields.username, params.username),
    }),
  );

  if (userResult.type === 'fail' || !userResult.value) {
    return fail('Erro ao buscar usuário');
  }

  const user = userResult.value;

  if (user.id === session.user.id) {
    return fail('Você não pode remover o ban de si mesmo');
  }

  try {
    await db.update(userTable).set({ isBanned: false }).where(eq(userTable.id, user.id)).execute();
    log.info(`Banimento removido: ${user.id} por ${session.user.id}`);
    return ok('Banimento removido com sucesso');
  } catch (error) {
    log.error('Erro ao remover banimento', { error });
    return fail('Erro ao remover banimento');
  }
}
