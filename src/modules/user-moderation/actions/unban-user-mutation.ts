'use server';

import { getActionSession } from '@/modules/auth/utils/get-action-session';
import { isAdminOrAbove } from '@/modules/auth/utils/is';
import { db } from '@/modules/database/db';
import { userTable } from '@/modules/database/schema/user';
import { log } from '@/modules/logging/lib/pino';
import { eq } from 'drizzle-orm';

export async function unbanUserMutation(params: { username: string }) {
  const session = await getActionSession();

  if (session === null) {
    throw new Error('Você não está autenticado');
  }

  if (!isAdminOrAbove(session.user.role)) {
    throw new Error('Você não tem permissão para remover ban de usuários');
  }

  if (!params.username) {
    throw new Error('Nome do usuário é obrigatório');
  }

  const user = await db.query.userTable.findFirst({
    columns: { id: true, isBanned: true },
    where: (fields, op) => op.eq(fields.username, params.username),
  });

  if (!user) {
    throw new Error('Usuário não encontrado');
  }

  if (user.id === session.user.id) {
    throw new Error('Você não pode remover o ban de si mesmo');
  }

  await db.update(userTable).set({ isBanned: false }).where(eq(userTable.id, user.id)).execute();

  log.info(`Banimento removido: ${user.id} por ${session.user.id}`);

  return { success: true };
}
