'use server';

import { getCurrentUser } from '@/modules/auth/services/next';
import { db } from '@/modules/database/db';
import { ReportStatus } from '@/modules/database/lib/report-enum';
import { reports } from '@/modules/database/schema/report';
import { fail, ok, type Result } from '@/shared/lib/result';
import { formatDistanceToNow, isBefore, sub } from 'date-fns';
import { createReportSchema, type CreateReportSchema } from '../schemas/create-report';

export async function reportUserMutation(params: CreateReportSchema): Promise<Result<string>> {
  const parsed = createReportSchema.safeParse(params);

  if (!parsed.success) {
    return fail(parsed.error.message);
  }

  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return fail('Faça login para reportar um usuário');
  }

  if (currentUser.banned) {
    return fail('Você está banido e não pode reportar usuários');
  }

  if (currentUser.id === parsed.data.userId) {
    return fail('Você não pode reportar a si mesmo');
  }

  const lastReportFromUser = await db.query.reports.findFirst({
    columns: {
      id: true,
      createdAt: true,
      status: true,
    },
    where: (fields, operators) => {
      return operators.and(operators.eq(fields.reportedById, currentUser.id));
    },
    orderBy: (fields, operators) => operators.desc(fields.createdAt),
  });

  const now = new Date();
  const timeout = { minutes: 15 };
  const timeoutDate = sub(now, timeout);

  if (lastReportFromUser && isBefore(lastReportFromUser.createdAt, timeoutDate)) {
    const distance = formatDistanceToNow(timeoutDate, {
      addSuffix: true,
    });

    return fail(`Aguarde ${distance} antes de fazer outro reporte`);
  }

  try {
    const [report] = await db
      .insert(reports)
      .values({
        description: parsed.data.description,
        reportedById: currentUser.id,
        userId: parsed.data.userId,
        status: ReportStatus.PENDING,
        type: parsed.data.type,
        // entidades relacionadas
        commentId: parsed.data.commentId,
        contentId: parsed.data.contentId,
        publicationId: parsed.data.publicationId,
        trailId: parsed.data.trailId,
        topicId: parsed.data.topicId,
      })
      .returning({ id: reports.id });

    if (!report) {
      return fail('Erro ao reportar usuário');
    }

    return ok('Usuário reportado');
  } catch (error) {
    console.error(error);
    return fail('Erro ao reportar usuário. Tente novamente mais tarde.');
  }
}
