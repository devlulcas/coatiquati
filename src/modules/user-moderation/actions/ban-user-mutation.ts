'use server';

import { validateRequest } from '@/modules/auth/services/lucia';
import { isAdminOrAbove, isHighPrivilegeAdmin } from '@/modules/auth/utils/is';
import { db } from '@/modules/database/db';
import { reportTable } from '@/modules/database/schema/report';
import { userTable } from '@/modules/database/schema/user';
import { log } from '@/modules/logging/lib/pino';
import { fail, ok, type Result } from '@/shared/lib/result';
import { eq } from 'drizzle-orm';

export async function banUserMutation(params: { reportId: number }): Promise<Result<string>> {
  const { user } = await validateRequest();

  if (user === null) {
    return fail('Você não está autenticado');
  }

  if (!isAdminOrAbove(user.role)) {
    return fail('Você não tem permissão para banir usuários');
  }

  if (!params.reportId) {
    return fail('ID do report é obrigatório');
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
    return fail('Report não encontrado');
  }

  if (report.reportedUser.id === user.id) {
    return fail('Você não pode banir a si mesmo');
  }

  if (isHighPrivilegeAdmin(report.reportedUser.role)) {
    return fail('Você não pode banir um administrador de alto privilégio');
  }

  return db.transaction(async db => {
    try {
      await db
        .update(reportTable)
        .set({ status: 'resolved', moderatorId: user.id })
        .where(eq(reportTable.id, params.reportId))
        .execute();

      await db
        .update(userTable)
        .set({ bannedAt: new Date() })
        .where(eq(userTable.id, report.reportedUser.id))
        .execute();

      log.info(`Usuário banido: ${report.reportedUser.id} por ${user.id} via reporte ${params.reportId}`);

      return ok('Usuário banido');
    } catch (error) {
      log.error(`Erro ao banir usuário`, String(error));
      return fail('Erro ao banir usuário');
    }
  });
}
