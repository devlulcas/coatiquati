import type { BanRegistryId, NewBanRegistry } from '../schemas/ban-registry';

export type UpdateBanDTO = Partial<NewBanRegistry> & {
	id: BanRegistryId;
};
