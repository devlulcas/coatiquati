'use server';

import { auth } from '@/modules/auth/lib/auth';
import { assertAuthenticated, getCurrentUser } from '@/modules/auth/services/next';
import { db } from '@/modules/database/db';
import { ReportStatus } from '@/modules/database/lib/report-enum';
import { reports } from '@/modules/database/schema/report';
import { fail, ok, type Result } from '@/shared/lib/result';
import { eq } from 'drizzle-orm';

export async function ignoreReportMutation(reportId: number): Promise<Result<string>> {
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
    return fail('Você não tem permissão para fazer isso!');
  }

  const report = await db.query.reports.findFirst({
    where: (fields, operators) =>
      operators.and(
        operators.eq(fields.id, reportId),
        operators.eq(fields.status, ReportStatus.PENDING),
        operators.isNull(fields.deletedAt),
        operators.ne(fields.userId, currentUser.id),
      ),
  });

  if (!report) {
    return fail('Denúncia não encontrada ou já foi processada');
  }

  try {
    const [result] = await db
      .update(reports)
      .set({ status: ReportStatus.REJECTED, moderatorId: currentUser.id })
      .where(eq(reports.id, reportId))
      .returning({ id: reports.id });

    if (!result) {
      return fail('Erro ao ignorar denúncia');
    }

    return ok('Denúncia ignorada com sucesso');
  } catch (error) {
    console.error(error);
    return fail('Erro ao ignorar denúncia');
  }
}
