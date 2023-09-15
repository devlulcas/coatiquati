import { type AuthUserTable } from '@/modules/database/schema/user';

export type Contributor = Pick<AuthUserTable, 'id' | 'username' | 'avatar'>;

export type User = AuthUserTable & {
  emailVerified: boolean;
};
