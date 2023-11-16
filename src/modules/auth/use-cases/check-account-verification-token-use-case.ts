import { z } from 'zod';
import { EmailVerificationTokenRepository } from '../repositories/email-verification-token-repository';
import { EmailVerificationService } from '../services/email-verification-service';
import { auth } from '../services/lucia';
import type { Session } from '../types/session';

const accountVerificationTokenSchema = z.object({
  token: z.string(),
});

type AccountVerificationTokenSchema = z.infer<typeof accountVerificationTokenSchema>;

export async function checkAccountVerificationTokenUseCase(
  params: AccountVerificationTokenSchema,
): Promise<Session | null> {
  const validatedParams = accountVerificationTokenSchema.safeParse(params);

  if (!validatedParams.success) {
    throw new Error('Invalid params');
  }

  const token = validatedParams.data.token;

  const emailVerificationTokenRepository = new EmailVerificationTokenRepository();
  const emailVerificationService = new EmailVerificationService(emailVerificationTokenRepository);

  try {
    const userId = await emailVerificationService.validateEmailVerificationToken(token);

    if (userId === null) {
      return null;
    }

    const user = await auth.getUser(userId);

    await auth.invalidateAllUserSessions(user.userId);

    await auth.updateUserAttributes(user.userId, {
      email_verified: true,
    });

    const session = await auth.createSession({
      userId: user.userId,
      attributes: {
        id: user.userId,
      },
    });

    return session;
  } catch (error) {
    console.error(error);
    return null;
  }
}
