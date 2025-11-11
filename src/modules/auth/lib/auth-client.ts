import {
  adminClient,
  passkeyClient,
  twoFactorClient,
  usernameClient,
} from 'better-auth/client/plugins';
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

export type Role = keyof typeof roles;
export function getRole(role: unknown): Role {
  if (typeof role !== 'string') {
    return 'user';
  }
  return role as Role;
}

export type Session = typeof authClient.$Infer.Session;
export type SessionData = Session['session'];
export type User = Session['user'] & { username: string };
