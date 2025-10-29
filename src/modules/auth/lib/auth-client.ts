import { adminClient, passkeyClient, twoFactorClient, usernameClient } from 'better-auth/client/plugins';
import { createAuthClient } from 'better-auth/react';
import { env } from '../../../env';
import { ac, roles } from './permissions';

export const authClient = createAuthClient({
  baseURL: env.NEXT_PUBLIC_WEBSITE,
  plugins: [
    usernameClient(),
    twoFactorClient(),
    passkeyClient(),
    adminClient({
      ac: ac,
      roles: roles,
    }),
  ],
});
