'use server';

import { getActionSession } from '@/modules/auth/utils/get-action-session';
import { isAdminOrAbove, isHighPrivilegeAdmin } from '@/modules/auth/utils/is';
import { db } from '@/modules/database/db';
import { reportTable } from '@/modules/database/schema/report';
import { userTable } from '@/modules/database/schema/user';
import { log } from '@/modules/logging/lib/pino';
import { eq } from 'drizzle-orm';

export async function banUserMutation(params: { reportId: number }) {
  const session = await getActionSession();

  if (session === null) {
    throw new Error('Você não está autenticado');
  }

  if (!isAdminOrAbove(session.user.role)) {
    throw new Error('Você não tem permissão para banir usuários');
  }

  if (!params.reportId) {
    throw new Error('ID do report é obrigatório');
  }

  const report = await db.query.reportTable.findFirst({
    where: (fields, op) => op.eq(fields.id, params.reportId),
    with: {
      reportedUser: {
        columns: {
          role: true,
          id: true,
        },
      },
    },
  });

  if (!report) {
    throw new Error('Report não encontrado');
  }

  if (report.reportedUser.id === session.user.id) {
    throw new Error('Você não pode banir a si mesmo');
  }

  if (isHighPrivilegeAdmin(report.reportedUser.role)) {
    throw new Error('Você não pode banir um administrador de alto privilégio');
  }

  await db.transaction(async db => {
    try {
      await db
        .update(reportTable)
        .set({ status: 'resolved', moderatorId: session.user.id })
        .where(eq(reportTable.id, params.reportId))
        .execute();

      await db.update(userTable).set({ isBanned: true }).where(eq(userTable.id, report.reportedUser.id)).execute();
      log.info(`Usuário banido: ${report.reportedUser.id} por ${session.user.id} via reporte ${params.reportId}`);
    } catch (error) {
      log.error(`Erro ao banir usuário`, String(error));
      throw new Error('Erro ao banir usuário');
    }
  });
}
