import { log } from '@/modules/logging/lib/pino';
import { EmailVerificationService } from '../services/email-verification-service';
import { auth } from '../services/lucia';
import type { Session } from '../types/session';

export async function checkAccountVerificationTokenMutation(token: string): Promise<Session | null> {
  const emailVerificationServive = new EmailVerificationService();

  const userId = await emailVerificationServive.validateToken(token).catch(error => {
    log.error('Erro ao tentar validar token de verificação de e-mail', { error });
    return null;
  });

  if (userId === null) return null;

  try {
    const user = await auth.getUser(userId);

    await auth.invalidateAllUserSessions(user.userId);

    await auth.updateUserAttributes(user.userId, {
      role: user.role,
      email: user.email,
      username: user.username,
      verified: Number(true),
    });

    return auth.createSession({
      userId: user.userId,
      attributes: { id: user.userId },
    });
  } catch (error) {
    log.error('Erro ao tentar verificar conta', { error });
    return null;
  }
}
