import { type Database } from '@/modules/database/db';
import {
  emailVerificationTokenTable,
  type EmailVerificationToken,
} from '@/modules/database/schema/email-verification-token';
import { eq } from 'drizzle-orm';
import { EMAIL_VERIFICATION_TOKEN_EXPIRES_IN } from '../constants/email-verification-token';

export type EmailVerificationTokenRepository = {
  getVerificationTokensByUserId(db: Database, userId: string): Promise<EmailVerificationToken[]>;
  getVerificationTokenById(db: Database, tokenId: string): Promise<EmailVerificationToken | null>;
  createVerificationToken(db: Database, userId: string, token: string): Promise<EmailVerificationToken | null>;
};

export class DrizzleEmailVerificationTokenRepository implements EmailVerificationTokenRepository {
  async createVerificationToken(db: Database, userId: string, token: string): Promise<EmailVerificationToken | null> {
    try {
      const results = await db
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
      console.error('createVerificationToken', error);
      return null;
    }
  }

  async getVerificationTokensByUserId(db: Database, userId: string): Promise<EmailVerificationToken[]> {
    try {
      const results = db
        .select()
        .from(emailVerificationTokenTable)
        .where(eq(emailVerificationTokenTable.userId, userId))
        .all();

      return results;
    } catch (error) {
      console.error('getVerificationTokensByUserId', error);
      return [];
    }
  }

  async getVerificationTokenById(db: Database, tokenId: string): Promise<EmailVerificationToken | null> {
    const results = await db.transaction(async tx => {
      try {
        const storedToken = tx
          .select()
          .from(emailVerificationTokenTable)
          .where(eq(emailVerificationTokenTable.id, tokenId))
          .get();

        if (!storedToken) throw new Error('Invalid token');

        const results = await db
          .delete(emailVerificationTokenTable)
          .where(eq(emailVerificationTokenTable.userId, storedToken.userId))
          .returning({ deletedId: emailVerificationTokenTable.id })
          .execute();

        if (results.length === 0) throw new Error('Invalid token');

        return storedToken;
      } catch (error) {
        tx.rollback();
        console.error('getVerificationTokenById', error);
        return null;
      }
    });

    return results ? results : null;
  }
}
