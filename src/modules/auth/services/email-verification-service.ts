import { db } from '@/modules/database/db';
import { log } from '@/modules/logging/lib/pino';
import { generateRandomString, isWithinExpiration } from 'lucia/utils';
import { EMAIL_VERIFICATION_TOKEN_EXPIRES_IN } from '../constants/email-verification-token';
import type { EmailVerificationTokenRepository } from '../repositories/email-verification-token-repository';

type EmailVerificationToken = string;
type UserId = string;

export class EmailVerificationService {
  constructor(private emailVerificationTokenRepository: EmailVerificationTokenRepository) {}

  /**
   * Gera um token de verificação de email para o usuário.
   * Se o usuário já tiver um token válido, o mesmo token é retornado.
   * @param userId Id do usuário
   * @returns O token de verificação de email ou null se não for possível gerar um token
   */
  async generateEmailVerificationToken(userId: string): Promise<EmailVerificationToken | null> {
    const storedUserTokens = await this.emailVerificationTokenRepository.getVerificationTokensByUserId(db, userId);

    // Se o token for válido por mais da metade do tempo de expiração, ele é reutilizável
    if (storedUserTokens.length > 0) {
      const reusableStoredToken = storedUserTokens.find(token => {
        return isWithinExpiration(Number(token.expires) - EMAIL_VERIFICATION_TOKEN_EXPIRES_IN / 2);
      });

      if (reusableStoredToken) return reusableStoredToken.id;
    }

    const newToken = generateRandomString(63);

    try {
      const r = await this.emailVerificationTokenRepository.createVerificationToken(db, userId, newToken);
      return newToken;
    } catch (error) {
      log.error('Error while creating email verification token', { error });
      return null;
    }
  }

  /**
   * Valida um token de verificação de email. Se o token for válido, retorna o id do usuário associado ao token.
   * @param token Token de verificação de email
   * @returns O id do usuário associado ao token. Retorna null se o token for inválido.
   */
  async validateEmailVerificationToken(token: string): Promise<UserId | null> {
    const storedToken = await this.emailVerificationTokenRepository.getVerificationTokenById(db, token);

    if (!storedToken) {
      log.warn('Invalid email verification token ', { token });
      return null;
    }

    // Converte de BigInt para Number
    const tokenExpires = Number(storedToken.expires);

    if (!isWithinExpiration(tokenExpires)) {
      const now = Date.now();
      const timeLeft = tokenExpires - now;
      log.warn('Expired email verification token ', { token, timeLeft });
      return null;
    }

    return storedToken.userId;
  }
}
