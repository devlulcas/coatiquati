import { type AuthUserTable } from '@/modules/database/schema/user';
import type { Trail } from '@/modules/trail/types/trail';

export type Contributor = Pick<AuthUserTable, 'id' | 'username' | 'avatar'>;

export type User = AuthUserTable;

export type UserProfile = User & {
  authoredTrails: Trail[];
};

export type UpdateUser = Partial<Pick<User, 'username' | 'avatar' | 'email' | 'role'>>;

export type UserId = AuthUserTable['id'];
