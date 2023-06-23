import type { User } from '$src/modules/user/entities/user.entity';
import type { BanRegistry } from '../schemas/ban-registry';

export type BanDTO = {
	reason: string;
	target: User;
	first: User;
	second: User | null;
	registry: BanRegistry;
};
