import type { AuthUser } from '$modules/user/schemas/auth-user';
import type { BanRegistry } from '../schemas/ban-registry';

export type BanDTO = {
	reason: string;
	target: AuthUser;
	first: AuthUser;
	second: AuthUser | null;
	registry: BanRegistry;
};
