'use server';

import { getActionSession } from '@/modules/auth/utils/get-action-session';
import { isAdminOrAbove } from '@/modules/auth/utils/is';
import { db } from '@/modules/database/db';
import { reportTable } from '@/modules/database/schema/report';
import { log } from '@/modules/logging/lib/pino';
import { eq } from 'drizzle-orm';

export async function ignoreReportMutation(reportId: number): Promise<void> {
  const session = await getActionSession();

  if (!session) {
    throw new Error('Entre para ignorar um reporte');
  }

  if (!isAdminOrAbove(session.user.role)) {
    throw new Error('Você não tem permissão para ignorar reportes');
  }

  const report = await db.query.reportTable.findFirst({
    where: (fields, op) => op.eq(fields.id, reportId),
  });

  if (!report) {
    throw new Error('Reporte não encontrado');
  }

  if (report.userId === session.user.id) {
    throw new Error('Você não pode ignorar um reporte seu');
  }

  await db.update(reportTable).set({ deletedAt: new Date() }).where(eq(reportTable.id, reportId)).execute();

  log.info(`Reporte ignorado: ${reportId} por ${session.user.id}`);
}
