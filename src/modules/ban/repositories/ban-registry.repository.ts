import type { ResultType } from '$lib/types/result';
import type { BanRegistry, BanRegistryId, NewBanRegistry } from '$modules/ban/schemas/ban-registry';
import type { UpdateBanDTO } from '../dtos/update-ban.dto';

export interface BanRegistryRepository {
	findById(id: BanRegistryId): Promise<ResultType<BanRegistry>>;
	update(data: UpdateBanDTO): Promise<ResultType<BanRegistry>>;
	create(data: NewBanRegistry): Promise<ResultType<BanRegistry>>;
}
