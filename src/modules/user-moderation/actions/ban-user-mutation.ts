'use server';

import { auth } from '@/modules/auth/lib/auth';
import { assertAuthenticated, getCurrentUser } from '@/modules/auth/services/next';
import { db } from '@/modules/database/db';
import { ReportStatus } from '@/modules/database/lib/report-enum';
import { reports } from '@/modules/database/schema/report';
import { toMS } from '@/shared/lib/date';
import { fail, ok, type Result } from '@/shared/lib/result';
import { eq } from 'drizzle-orm';
import z from 'zod';

const banUserMutationSchema = z.object({
  reportId: z.number(),
});

type BanUserMutationParams = z.infer<typeof banUserMutationSchema>;

export async function banUserMutation(params: BanUserMutationParams): Promise<Result<string>> {
  const parsed = banUserMutationSchema.safeParse(params);

  if (!parsed.success) {
    return fail(parsed.error.message);
  }

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
    return fail('Você não tem permissão para banir usuários');
  }

  if (!params.reportId) {
    return fail('ID do report é obrigatório');
  }

  const report = await db.query.reports.findFirst({
    where: (fields, operators) => {
      return operators.and(
        operators.eq(fields.id, params.reportId),
        operators.eq(fields.status, ReportStatus.PENDING),
        operators.isNull(fields.deletedAt),
        operators.ne(fields.userId, currentUser.id),
      );
    },
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
    return fail('Não foi possível banir o usuário. Denúncia não encontrada ou já foi processada.');
  }

  if (report.reportedUser.role === 'superAdmin') {
    return fail('Você não pode banir um super administrador');
  }

  return db.transaction(async tx => {
    try {
      await tx
        .update(reports)
        .set({ status: ReportStatus.RESOLVED, moderatorId: currentUser.id })
        .where(eq(reports.id, params.reportId))
        .execute();

      await auth.api.banUser({
        body: {
          userId: report.reportedUser.id,
          banReason: report.description,
          banExpiresIn: toMS(1, 'months'),
        },
      });

      return ok('Usuário banido');
    } catch (error) {
      console.error(error);
      tx.rollback();
      return fail('Não foi possível banir o usuário. Erro ao processar a denúncia.');
    }
  });
}
