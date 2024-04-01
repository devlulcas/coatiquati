import { log } from '@/modules/logging/lib/pino';
import { isWithinExpiration } from 'lucia/utils';
import { EmailVerificationTokenRepository } from '../repositories/email-verification-token-repository';

export class EmailVerificationService {
  constructor(
    private emailVerificationTokenRepository: EmailVerificationTokenRepository = new EmailVerificationTokenRepository(),
  ) {}

  /**
   * Gera um token de verificação de email para o usuário.
   * Se o usuário já tiver um token válido, o mesmo token é retornado.
   * @param userId Id do usuário
   * @returns O token de verificação de email ou null se não for possível gerar um token
   */
  async generateToken(userId: string): Promise<string | null> {
    try {
      const insertedToken = await this.emailVerificationTokenRepository.createVerificationToken(userId);
      return insertedToken ? insertedToken.id : null;
    } catch (error) {
      log.error('Erro ao tentar criar token de verificação de e-mail', { error });
      return null;
    }
  }

  /**
   * Valida um token de verificação de email. Se o token for válido, retorna o id do usuário associado ao token.
   * @param token Token de verificação de email
   * @returns O id do usuário associado ao token. Retorna null se o token for inválido.
   */
  async validateToken(token: string): Promise<string | null> {
    const storedToken = await this.emailVerificationTokenRepository.getVerificationTokenById(token);

    if (!storedToken) {
      log.warn('Invalid email verification token ', { token });
      return null;
    }

    // Converte de BigInt para Number
    if (!isWithinExpiration(storedToken.expiresAt.getTime())) {
      const now = Date.now();
      const timeLeft = storedToken.expiresAt.getTime() - now;
      log.warn('Expired email verification token ', { token, timeLeft });
      return null;
    }

    return storedToken.userId;
  }
}
