import type { ResultType } from '$lib/types/result';
import type { BanRegistry, NewBanRegistry } from '$modules/ban/schemas/ban-registry';

export interface BanRegistryRepository {
	findById(id: number): Promise<ResultType<BanRegistry>>;
	update(id: number, data: Partial<NewBanRegistry>): Promise<ResultType<BanRegistry>>;
	create(data: NewBanRegistry): Promise<ResultType<BanRegistry>>;
}
