import { db } from '@/modules/database/db';
import {
  emailVerificationTokenTable,
  type EmailVerificationToken,
} from '@/modules/database/schema/email-verification-token';
import { log } from '@/modules/logging/lib/pino';
import { eq } from 'drizzle-orm';
import { EMAIL_VERIFICATION_TOKEN_EXPIRES_IN } from '../constants/email-verification-token';
import { isWithinExpiration } from '../utils/time';
import { generateIdFromEntropySize } from 'lucia';

export class EmailVerificationTokenRepository {
  async createVerificationToken(userId: string, database = db): Promise<EmailVerificationToken | null> {
    try {
      const storedUserTokens = await database
        .select()
        .from(emailVerificationTokenTable)
        .where(eq(emailVerificationTokenTable.userId, userId))
        .all();

      // Se o token for válido por mais da metade do tempo de expiração, ele é reutilizável
      if (storedUserTokens.length > 0) {
        const halfLifetime = EMAIL_VERIFICATION_TOKEN_EXPIRES_IN / 2;
        const reusableStoredToken = storedUserTokens.find(token =>
          isWithinExpiration(token.expiresAt.getTime() - halfLifetime),
        );
        if (reusableStoredToken) return reusableStoredToken;
      }

      const newToken = generateIdFromEntropySize(64);

      const results = await database
        .insert(emailVerificationTokenTable)
        .values({
          id: newToken,
          userId: userId,
          expiresAt: new Date(Date.now() + EMAIL_VERIFICATION_TOKEN_EXPIRES_IN),
        })
        .returning()
        .execute();

      const verificationToken = results[0];

      return verificationToken ? verificationToken : null;
    } catch (error) {
      log.error('createVerificationToken:' + (error instanceof Error ? error.message : String(error)));
      return null;
    }
  }

  async getVerificationTokenById(tokenId: string): Promise<EmailVerificationToken | null> {
    return db.transaction(async tx => {
      try {
        const storedToken = await tx
          .select()
          .from(emailVerificationTokenTable)
          .where(eq(emailVerificationTokenTable.id, tokenId))
          .get();

        if (!storedToken) {
          log.error('Token de verificação de e-mail não encontrado', { tokenId });
          throw new Error('Token de verificação de e-mail não encontrado');
        }

        const results = await tx
          .delete(emailVerificationTokenTable)
          .where(eq(emailVerificationTokenTable.userId, storedToken.userId))
          .returning({ deletedId: emailVerificationTokenTable.id })
          .execute();

        if (results.length === 0) {
          log.error('Erro ao deletar token de verificação de e-mail', { tokenId });
          throw new Error('Erro ao deletar token de verificação de e-mail');
        }

        return storedToken;
      } catch (error) {
        log.error('Erro ao buscar token de verificação de e-mail', { error });
        tx.rollback();
        return null;
      }
    });
  }
}
