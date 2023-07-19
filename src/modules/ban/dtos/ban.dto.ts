import type { User } from "$modules/user/types/user";
import type { BanRegistryTable } from "../schemas/ban-registry";

export type BanSchema = {
	reason: string;
	target: User;
	first: User;
	second: User | null;
	registry: BanRegistryTable;
};
