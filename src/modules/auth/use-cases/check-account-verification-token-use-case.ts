import { z } from 'zod';
import { EmailVerificationService } from '../services/email-verification-service';
import { auth } from '../services/lucia';
import type { Session } from '../types/session';

const accountVerificationTokenSchema = z.object({
  token: z.string(),
});

type AccountVerificationTokenSchema = z.infer<typeof accountVerificationTokenSchema>;

export class CheckAccountVerificationTokenUseCase {
  constructor(private readonly emailVerificationServive: EmailVerificationService = new EmailVerificationService()) {}

  async execute(params: AccountVerificationTokenSchema): Promise<Session | null> {
    const validatedParams = accountVerificationTokenSchema.safeParse(params);

    if (!validatedParams.success) {
      throw new Error('Invalid params');
    }

    const token = validatedParams.data.token;

    try {
      const userId = await this.emailVerificationServive.validateEmailVerificationToken(token);

      if (userId === null) {
        return null;
      }

      const user = await auth.getUser(userId);

      console.log('>>>>>>>>>>>>> user', user);

      await auth.invalidateAllUserSessions(user.userId);

      await auth.updateUserAttributes(user.userId, {
        email_verified: Number(true),
        role: user.role,
        email: user.email,
        username: user.username,
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
}
