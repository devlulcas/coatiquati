'use server';

import { log } from '@/modules/logging/lib/pino';
import { EmailVerificationService } from '../services/email-verification-service';
import { auth } from '../services/lucia';
import type { Session } from '../types/session';
import { db } from '@/modules/database/db';
import { userTable } from '@/modules/database/schema/user';
import { eq } from 'drizzle-orm';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { fail } from '@/shared/lib/result';

export async function verifyEmailMutation(token: string) {
  const emailVerificationServive = new EmailVerificationService();

  const userId = await emailVerificationServive.validateToken(token).catch(error => {
    log.error('Erro ao tentar validar token de verificação de e-mail', { error });
    return null;
  });

  if (userId === null) {
    return fail('Token de verificação de e-mail inválido.');
  }

  try {
    await auth.invalidateUserSessions(userId);
    const updatedUser = await db
      .update(userTable)
      .set({ verifiedAt: new Date() })
      .where(eq(userTable.id, userId))
      .execute();
    log.info('Conta verificada', { userId, updatedUser });
    const session = await auth.createSession(userId, {});
    const sessionCookie = auth.createSessionCookie(session.id);
    cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
    return redirect('/');
  } catch (error) {
    log.error('Erro ao tentar verificar conta', { error });
    return fail('Erro ao tentar verificar conta.');
  }
}
