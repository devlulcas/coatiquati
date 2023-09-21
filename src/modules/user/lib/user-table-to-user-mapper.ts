import type { AuthUserTable } from '@/modules/database/schema/user';
import type { User } from '../types/user';

export function userTableToUserMapper(
  user: AuthUserTable,
  incognito: boolean
): User {
  return {
    ...user,
    emailVerified: Boolean(user.email_verified),
    email: incognito
      ? user.email.replace(/(.{2})(.*)(@.*)/, '$1...$3')
      : user.email,
  };
}
