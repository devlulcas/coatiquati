import type { BanRegistryTableId, NewBanRegistryTable } from "../schemas/ban-registry";

export type UpdateBanSchema = Partial<NewBanRegistryTable> & {
	id: BanRegistryTableId;
};
