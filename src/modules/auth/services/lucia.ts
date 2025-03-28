import { sqlite } from '@/modules/database/db';
import type { AuthUserTable } from '@/modules/database/schema/user';
import type { PublicUser } from '@/modules/user/types/user';
import { LibSQLAdapter } from '@lucia-auth/adapter-sqlite';
import type { Session, User } from 'lucia';
import { Lucia } from 'lucia';
import { cookies } from 'next/headers';
import { cache } from 'react';
import type { PublicSession } from '../types/session';

const adapter = new LibSQLAdapter(sqlite, {
  user: 'user',
  session: 'user_session',
});

export const auth = new Lucia(adapter, {
  sessionCookie: {
    attributes: {
      secure: process.env.NODE_ENV === 'production',
    },
  },
  getUserAttributes: attributes => {
    return {
      username: attributes.username,
      role: attributes.role,
      avatar: attributes.avatar,
      email: attributes.email,
      verifiedAt: attributes.verifiedAt,
      bannedAt: attributes.bannedAt,
    };
  },
});

export const validateRequest = cache(
  async (): Promise<{ user: User; session: Session } | { user: null; session: null }> => {
    const jar = await cookies();
    const sessionId = jar.get(auth.sessionCookieName)?.value ?? null;
    if (!sessionId) {
      return {
        user: null,
        session: null,
      };
    }

    const result = await auth.validateSession(sessionId);

    // next.js throws when you attempt to set cookie when rendering page
    try {
      if (result.session && result.session.fresh) {
        const sessionCookie = auth.createSessionCookie(result.session.id);
        jar.set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
      }
      if (!result.session) {
        const sessionCookie = auth.createBlankSessionCookie();
        jar.set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
      }
    } catch { }
    return result;
  },
);

export const toPublicSession = (user?: User): PublicSession => {
  if (!user) {
    return { data: null, status: 'unauthenticated' };
  }

  const publicUser: PublicUser = {
    id: user.id,
    username: user.username,
    avatar: user.avatar,
    role: user.role,
  };

  return { data: publicUser, status: 'authenticated' };
}

declare module 'lucia' {
  interface Register {
    Lucia: typeof auth;
    DatabaseUserAttributes: Omit<AuthUserTable, 'id'>;
  }
}
