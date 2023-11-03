import { env } from '@/env';
import { sqlite } from '@/modules/database/db';
import { betterSqlite3 } from '@lucia-auth/adapter-sqlite';
import { lucia } from 'lucia';
import { nextjs_future } from 'lucia/middleware';
import 'lucia/polyfill/node';

export const auth = lucia({
  env: env.NODE_ENV === 'production' ? 'PROD' : 'DEV',
  middleware: nextjs_future(),
  sessionCookie: { expires: false },
  adapter: betterSqlite3(sqlite, {
    user: 'user',
    key: 'user_key',
    session: 'user_session',
  }),
  getUserAttributes: data => {
    return {
      id: data.id,
      username: data.username,
      role: data.role,
      email: data.email,
      emailVerified: data.email_verified,
    };
  },
  getSessionAttributes: data => {
    return {
      userId: data.user_id,
    };
  },
});

export type Auth = typeof auth;
