import { env } from '@/env';
import { sqlite } from '@/modules/database/db';
import { libsql } from '@lucia-auth/adapter-sqlite';
import { lucia } from 'lucia';
import { nextjs_future } from 'lucia/middleware';
import 'lucia/polyfill/node';

export type UserSchema = Omit<
  Parameters<Exclude<Parameters<typeof lucia>['0']['getUserAttributes'], undefined>>[0],
  'isBanned' | 'verified'
> & {
  is_banned: number;
  email_verified: number;
};

export const auth = lucia({
  env: env.NODE_ENV === 'production' ? 'PROD' : 'DEV',
  middleware: nextjs_future(),
  sessionCookie: { expires: false },
  adapter: libsql(sqlite, {
    user: 'user',
    key: 'user_key',
    session: 'user_session',
  }),
  getUserAttributes: data => {
    const realData = data as unknown as UserSchema;

    return {
      id: data.id,
      username: data.username,
      role: data.role,
      email: data.email,
      verified: Boolean(realData.email_verified),
      isBanned: Boolean(realData.is_banned),
    };
  },
  getSessionAttributes: data => {
    return {
      userId: data.user_id,
    };
  },
});

export type Auth = typeof auth;
