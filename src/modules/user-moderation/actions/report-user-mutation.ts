'use server';

import { getActionSession } from '@/modules/auth/utils/get-action-session';
import { db } from '@/modules/database/db';
import { reportTable, type ReportInsert } from '@/modules/database/schema/report';
import { log } from '@/modules/logging/lib/pino';
import { desc, eq } from 'drizzle-orm';
import type { ReportReason } from '../constants/report';
import { createReportSchema, type CreateReportSchema } from '../schemas/create-report';

export async function reportUserMutation(params: CreateReportSchema): Promise<void> {
  const validatedParams = createReportSchema.safeParse(params);

  if (!validatedParams.success) {
    throw new Error(validatedParams.error.errors[0].message);
  }

  const session = await getActionSession();

  if (!session) {
    throw new Error('Entre para reportar um usuário');
  }

  if (session.user.isBanned) {
    throw new Error('Você está banido e não pode reportar usuários');
  }

  if (session.user.id === validatedParams.data.userId) {
    throw new Error('Você não pode reportar você mesmo');
  }

  const lastReportFromUser = await db
    .select()
    .from(reportTable)
    .where(eq(reportTable.reportedById, session.user.id))
    .orderBy(desc(reportTable.createdAt))
    .limit(1)
    .get();

  const FITTEEN_MINUTES = 900000;

  const timeSinceLastReport = lastReportFromUser
    ? Date.now() - lastReportFromUser.createdAt.getTime()
    : FITTEEN_MINUTES;

  if (timeSinceLastReport < FITTEEN_MINUTES) {
    throw new Error('Aguarde 15 minutos antes de fazer outro reporte');
  }

  // Salva o reporte
  const data: ReportInsert = {
    description: validatedParams.data.description,
    reportedById: session.user.id,
    reportedEntityId: validatedParams.data.reportedEntityId,
    reportedEntityType: validatedParams.data.reportedEntityType,
    type: validatedParams.data.type as ReportReason, // Já foi validado pelo zod
    userId: validatedParams.data.userId,
  };

  try {
    await db.insert(reportTable).values(data).execute();
    log.info(`Usuário ${session.user.id} reportou usuário ${data.userId} por ${data.type}`);
  } catch (error) {
    log.error(`Erro ao reportar usuário ${data.userId} por ${data.type}`, error);
    throw new Error('Erro ao reportar usuário');
  }
}
