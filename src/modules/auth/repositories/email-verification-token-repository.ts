import { db, type Database } from '@/modules/database/db';
import {
  emailVerificationTokenTable,
  type EmailVerificationToken,
} from '@/modules/database/schema/email-verification-token';
import { log } from '@/modules/logging/lib/pino';
import { eq } from 'drizzle-orm';
import { EMAIL_VERIFICATION_TOKEN_EXPIRES_IN } from '../constants/email-verification-token';

export class EmailVerificationTokenRepository {
  async createVerificationToken(userId: string, token: string, database = db): Promise<EmailVerificationToken | null> {
    try {
      const results = await database
        .insert(emailVerificationTokenTable)
        .values({
          id: token,
          userId: userId,
          expires: BigInt(new Date().getTime() + EMAIL_VERIFICATION_TOKEN_EXPIRES_IN),
        })
        .returning()
        .execute();

      const verificationToken = results[0];

      return verificationToken ? verificationToken : null;
    } catch (error) {
      log.error('createVerificationToken', error);
      return null;
    }
  }

  async getVerificationTokensByUserId(userId: string, database = db): Promise<EmailVerificationToken[]> {
    try {
      const results = database
        .select()
        .from(emailVerificationTokenTable)
        .where(eq(emailVerificationTokenTable.userId, userId))
        .all();

      return results;
    } catch (error) {
      log.error('getVerificationTokensByUserId', { error });
      return [];
    }
  }

  async getVerificationTokenById(tokenId: string, database = db): Promise<EmailVerificationToken | null> {
    const results = await database.transaction(async tx => {
      try {
        const storedToken = tx
          .select()
          .from(emailVerificationTokenTable)
          .where(eq(emailVerificationTokenTable.id, tokenId))
          .get();

        if (!storedToken) throw new Error('Invalid token');

        const results = await tx
          .delete(emailVerificationTokenTable)
          .where(eq(emailVerificationTokenTable.userId, storedToken.userId))
          .returning({ deletedId: emailVerificationTokenTable.id })
          .execute();

        if (results.length === 0) throw new Error('Invalid token');

        return storedToken;
      } catch (error) {
        log.error('Erro ao buscar token de verificação de e-mail', { error });
        tx.rollback();
        return null;
      }
    });

    return results;
  }
}
