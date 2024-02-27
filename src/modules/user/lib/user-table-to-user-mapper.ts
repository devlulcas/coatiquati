import type { AuthUserTable } from '@/modules/database/schema/user';
import type { User } from '../types/user';

export function userTableToUserMapper(user: AuthUserTable): User {
  return {
    ...user,
    emailVerified: Boolean(user.email_verified),
    email: user.email,
  };
}
