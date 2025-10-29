import { env } from '@/env';
import { toMilliseconds } from '@/shared/lib/date';
import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { admin, twoFactor, username } from 'better-auth/plugins';
import { passkey } from 'better-auth/plugins/passkey';
import { db } from '../../database/db';
import { usernameSchema } from '../schemas/user-sign-up-schema';
import { ac, roles } from './permissions';

export const auth = betterAuth({
  appName: 'CoatiQuati',
  database: drizzleAdapter(db, { provider: 'pg' }),
  emailAndPassword: { enabled: true },
  plugins: [
    username({
      usernameValidator: (username) => {
        const result = usernameSchema.safeParse(username);
        return result.success;
      },
    }),
    twoFactor(),
    passkey({
      rpID: env.NEXT_PUBLIC_WEBSITE,
      rpName: 'CoatiQuati',
      origin: env.NEXT_PUBLIC_WEBSITE,
    }),
    admin({
      ac: ac,
      roles: roles,
      defaultRole: 'superAdmin',
      adminRoles: ['admin', 'superAdmin'],
      userRoles: ['user'],
      impersonationSessionDuration: toMilliseconds(1, 'days'),
    }),
  ],
});
