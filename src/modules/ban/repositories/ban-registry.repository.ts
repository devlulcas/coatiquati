import type { ResultType } from '$lib/types/result';
import type { UpdateBanSchema } from '../dtos/update-ban.dto';
import type { BanRegistryTable, BanRegistryTableId, NewBanRegistryTable } from '../schemas/ban-registry';

export interface BanRegistryRepository {
	findById(id: BanRegistryTableId): Promise<ResultType<BanRegistryTable>>;
	update(data: UpdateBanSchema): Promise<ResultType<BanRegistryTable>>;
	create(data: NewBanRegistryTable): Promise<ResultType<BanRegistryTable>>;
}
