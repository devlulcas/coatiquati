import { db } from '@/modules/database/db';
import { sessionTable } from '@/modules/database/schema/session';
import { userTable } from '@/modules/database/schema/user';
import { log } from '@/modules/logging/lib/pino';
import type { User } from '@/modules/user/types/user';
import { toMilliseconds } from '@/shared/lib/date';
import { isFail, wrapAsyncInResult } from '@/shared/lib/result';
import { sha256 } from '@oslojs/crypto/sha2';
import { encodeBase32LowerCaseNoPadding, encodeHexLowerCase } from '@oslojs/encoding';
import { eq } from 'drizzle-orm';
import type { PublicSession, Session } from '../types/session';

export const toPublicSession = (user?: User, session?: Session): PublicSession => {
  if (!user || !session) {
    return { data: null, status: 'unauthenticated' };
  }

  const publicUser: PublicSession['data'] = {
    id: user.id,
    username: user.username,
    avatar: user.avatar,
    role: user.role,
    bannedAt: user.bannedAt,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    email: user.email,
    verifiedAt: user.verifiedAt,
    sessionId: session.id,
  };

  return { data: publicUser, status: 'authenticated' };
};

export function generateSessionToken(): string {
  const bytes = new Uint8Array(20);
  crypto.getRandomValues(bytes);
  const token = encodeBase32LowerCaseNoPadding(bytes);
  return token;
}

export async function createSession(token: string, userId: string): Promise<Session> {
  const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
  const session: Session = {
    id: sessionId,
    userId,
    expiresAt: new Date(Date.now() + toMilliseconds(30, 'days')),
  };

  return db.insert(sessionTable).values(session).returning().get();
}

export async function validateSessionToken(token: string): Promise<SessionValidationResult> {
  const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));

  const result = await wrapAsyncInResult(
    db
      .select({ user: userTable, session: sessionTable })
      .from(sessionTable)
      .innerJoin(userTable, eq(sessionTable.userId, userTable.id))
      .where(eq(sessionTable.id, sessionId)),
  );

  if (isFail(result) || result.value.length < 1) {
    return { session: null, user: null };
  }

  const { user, session } = result.value[0];

  if (Date.now() >= session.expiresAt.getTime()) {
    await db.delete(sessionTable).where(eq(sessionTable.id, session.id));
    return { session: null, user: null };
  }

  if (Date.now() >= session.expiresAt.getTime() - toMilliseconds(15, 'days')) {
    session.expiresAt = new Date(Date.now() + toMilliseconds(30, 'days'));

    const res = await wrapAsyncInResult(
      db.update(sessionTable).set({ expiresAt: session.expiresAt }).where(eq(sessionTable.id, session.id)),
    );

    if (isFail(res)) {
      log.error('Failed to update session expiration', { error: res });
      return { session: null, user: null };
    }
  }

  return { session, user };
}

export async function invalidateSession(sessionId: string): Promise<void> {
  await wrapAsyncInResult(db.delete(sessionTable).where(eq(sessionTable.id, sessionId)));
}

export async function invalidateAllSessions(userId: string): Promise<void> {
  await wrapAsyncInResult(db.delete(sessionTable).where(eq(sessionTable.userId, userId)));
}

export type SessionValidationResult = { session: Session; user: User } | { session: null; user: null };
