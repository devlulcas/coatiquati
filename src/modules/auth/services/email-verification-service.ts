import { db } from '@/modules/database/db';
import { generateRandomString, isWithinExpiration } from 'lucia/utils';
import { EMAIL_VERIFICATION_TOKEN_EXPIRES_IN } from '../constants/email-verification-token';
import type { EmailVerificationTokenRepository } from '../repositories/email-verification-token-repository';

type EmailVerificationToken = string;
type UserId = string;

export class EmailVerificationService {
  constructor(private emailVerificationTokenRepository: EmailVerificationTokenRepository) {}

  async generateEmailVerificationToken(userId: string): Promise<EmailVerificationToken> {
    const storedUserTokens = await this.emailVerificationTokenRepository.getVerificationTokensByUserId(db, userId);

    if (storedUserTokens.length > 0) {
      const reusableStoredToken = storedUserTokens.find(token => {
        return isWithinExpiration(Number(token.expires) - EMAIL_VERIFICATION_TOKEN_EXPIRES_IN / 2);
      });

      if (reusableStoredToken) return reusableStoredToken.id;
    }

    const token = generateRandomString(63);

    await this.emailVerificationTokenRepository.createVerificationToken(db, userId, token);

    return token;
  }

  async validateEmailVerificationToken(token: string): Promise<UserId> {
    const storedToken = await this.emailVerificationTokenRepository.getVerificationTokenById(db, token);

    if (!storedToken) {
      throw new Error('Invalid token');
    }

    const tokenExpires = Number(storedToken.expires);

    if (!isWithinExpiration(tokenExpires)) {
      throw new Error('Expired token');
    }

    return storedToken.userId;
  }
}
