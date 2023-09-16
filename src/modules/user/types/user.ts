import { type AuthUserTable } from '@/modules/database/schema/user';
import type { Trail } from '@/modules/trail/types/trail';

export type Contributor = Pick<AuthUserTable, 'id' | 'username' | 'avatar'>;

export type User = Omit<AuthUserTable, 'email_verified'> & {
  emailVerified: boolean;
};

export type UserProfile = User & {
  authoredTrails: Trail[];
};
