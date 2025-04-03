'use server';

import { db } from '@/modules/database/db';
import { userTable } from '@/modules/database/schema/user';
import { log } from '@/modules/logging/lib/pino';
import { fail, ok } from '@/shared/lib/result';
import { eq } from 'drizzle-orm';
import { createSession, generateSessionToken, invalidateAllSessions } from '../services/auth';
import { validateToken } from '../services/email-verification-service';

export async function verifyEmailMutation(token: string) {
  const userId = await validateToken(token).catch(error => {
    log.error('Erro ao tentar validar token de verificação de e-mail', { error });
    return null;
  });

  if (userId === null) {
    return fail('Token de verificação de e-mail inválido.');
  }

  try {
    await invalidateAllSessions(userId);
    const updatedUser = await db
      .update(userTable)
      .set({ verifiedAt: new Date() })
      .where(eq(userTable.id, userId))
      .execute();
    log.info('Conta verificada', { userId, updatedUser });
    const token = generateSessionToken();
    const session = await createSession(token, userId);
    return ok({ token, session });
  } catch (error) {
    log.error('Erro ao tentar verificar conta', { error });
    return fail('Erro ao tentar verificar conta.');
  }
}
