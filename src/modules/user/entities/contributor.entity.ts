import type { AuthUser } from '../schemas/auth-user';

export type Contributor = Pick<AuthUser, 'id' | 'username' | 'avatar'>;
