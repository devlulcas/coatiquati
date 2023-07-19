import { db } from '$lib/server/db';
import { Fail, Ok, type ResultType } from '$lib/types/result';
import { eq } from 'drizzle-orm';
import type { UpdateBanSchema } from '../dtos/update-ban.dto';
import { banRegistryTable, type BanRegistryTable, type BanRegistryTableId, type NewBanRegistryTable } from '../schemas/ban-registry';
import type { BanRegistryRepository } from './ban-registry.repository';

export class PostgresBanRegistryRepository implements BanRegistryRepository {
	async findById(id: BanRegistryTableId): Promise<ResultType<BanRegistryTable>> {
		const registries = await db.select().from(banRegistryTable).where(eq(banRegistryTable.id, id));

		const registry = registries[0];

		if (!registry) {
			return Fail('Registry not found');
		}

		return Ok(registry);
	}

	async update(data: UpdateBanSchema): Promise<ResultType<BanRegistryTable>> {
		const updatedRegistries = await db.update(banRegistryTable).set(data).where(eq(banRegistryTable.id, data.id)).returning();

		const updatedRegistry = updatedRegistries[0];

		if (!updatedRegistry) {
			return Fail('Registry not found');
		}

		return Ok(updatedRegistry);
	}

	async create(data: NewBanRegistryTable): Promise<ResultType<BanRegistryTable>> {
		const newRegistry = await db.insert(banRegistryTable).values(data).returning();
		return Ok(newRegistry[0]);
	}
}
