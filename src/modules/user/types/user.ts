import type { AuthUserTable } from '../schemas/auth-user';

export type User = AuthUserTable;

export type UserId = AuthUserTable['id'];

export type Contributor = Pick<User, 'id' | 'username' | 'avatar'>;
