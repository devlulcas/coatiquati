'use server';

import { validateRequest } from '@/modules/auth/services/next';
import { db } from '@/modules/database/db';
import { reportTable, type ReportInsert } from '@/modules/database/schema/report';
import { log } from '@/modules/logging/lib/pino';
import { fail, isFail, ok, wrapAsyncInResult, type Result } from '@/shared/lib/result';
import { desc, eq } from 'drizzle-orm';
import type { ReportReason } from '../constants/report';
import { createReportSchema, type CreateReportSchema } from '../schemas/create-report';

export async function reportUserMutation(params: CreateReportSchema): Promise<Result<string>> {
  const validatedParams = createReportSchema.safeParse(params);

  if (!validatedParams.success) {
    return fail(validatedParams.error.errors[0].message);
  }

  const { data: user } = await validateRequest();

  if (!user) {
    return fail('Entre para reportar um usuário');
  }

  if (user.bannedAt) {
    return fail('Você está banido e não pode reportar usuários');
  }

  if (user.id === validatedParams.data.userId) {
    return fail('Você não pode reportar você mesmo');
  }

  const lastReportFromUserResult = await wrapAsyncInResult(
    db
      .select()
      .from(reportTable)
      .where(eq(reportTable.reportedById, user.id))
      .orderBy(desc(reportTable.createdAt))
      .limit(1)
      .get(),
  );

  if (isFail(lastReportFromUserResult)) {
    return fail('Erro ao buscar reportes do usuário');
  }

  const lastReportFromUser = lastReportFromUserResult.value;

  const FITTEEN_MINUTES = 900000;

  const timeSinceLastReport = lastReportFromUser
    ? Date.now() - lastReportFromUser.createdAt.getTime()
    : FITTEEN_MINUTES;

  if (timeSinceLastReport < FITTEEN_MINUTES) {
    return fail('Aguarde 15 minutos antes de fazer outro reporte');
  }

  // Salva o reporte
  const data: ReportInsert = {
    description: validatedParams.data.description,
    reportedById: user.id,
    reportedEntityId: validatedParams.data.reportedEntityId,
    reportedEntityType: validatedParams.data.reportedEntityType,
    type: validatedParams.data.type as ReportReason, // Já foi validado pelo zod
    userId: validatedParams.data.userId,
  };

  try {
    await db.insert(reportTable).values(data).execute();
    log.info(`Usuário ${user.id} reportou usuário ${data.userId} por ${data.type}`);
    return ok('Usuário reportado');
  } catch (error) {
    log.error(`Erro ao reportar usuário ${data.userId} por ${data.type}`, error);
    return fail('Erro ao reportar usuário');
  }
}
