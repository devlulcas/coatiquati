'use server';

import { getActionSession } from '@/modules/auth/utils/get-action-session';
import { isAdminOrAbove } from '@/modules/auth/utils/is';
import { db } from '@/modules/database/db';
import { reportTable } from '@/modules/database/schema/report';
import { log } from '@/modules/logging/lib/pino';
import { fail, ok, type Result } from '@/shared/lib/result';
import { eq } from 'drizzle-orm';

export async function ignoreReportMutation(reportId: number): Promise<Result<string>> {
  const session = await getActionSession();

  if (!session) {
    return fail('Entre para ignorar um reporte');
  }

  if (!isAdminOrAbove(session.user.role)) {
    return fail('Você não tem permissão para ignorar reportes');
  }

  const report = await db.query.reportTable.findFirst({
    where: (fields, op) => op.eq(fields.id, reportId),
  });

  if (!report) {
    return fail('Reporte não encontrado');
  }

  if (report.userId === session.user.id) {
    return fail('Você não pode ignorar um reporte seu');
  }

  try {
    await db.update(reportTable).set({ deletedAt: new Date() }).where(eq(reportTable.id, reportId)).execute();
    log.info('Reporte ignorado com sucesso', { reportId, userId: session.user.id });
    return ok('Reporte ignorado com sucesso');
  } catch (error) {
    log.error('Erro ao ignorar reporte', { error });
    return fail('Erro ao ignorar reporte');
  }
}
