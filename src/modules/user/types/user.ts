import { type AuthUserTable } from '@/modules/database/schema/user';
import type { Trail } from '@/modules/trail/types/trail';

export type Contributor = Pick<AuthUserTable, 'id' | 'username' | 'avatar'>;

export type User = AuthUserTable;

export type UserProfile = User & {
  authoredTrails: Trail[];
  followers: { avatar: string; username: string }[];
  following: { avatar: string; username: string }[];
};

export type UpdateUser = Partial<Pick<User, 'username' | 'avatar' | 'email' | 'role' | 'verifiedAt' | 'bannedAt'>>;

export type UserId = AuthUserTable['id'];

export type PublicUser = Pick<User, 'id' | 'username' | 'avatar' | 'role'>; 
