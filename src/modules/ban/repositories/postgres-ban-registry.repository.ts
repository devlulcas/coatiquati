import { db } from '$lib/server/db';
import { Fail, Ok, type ResultType } from '$lib/types/result';
import { eq } from 'drizzle-orm';
import { banRegistry, type BanRegistry, type NewBanRegistry } from '../schemas/ban-registry';
import type { BanRegistryRepository } from './ban-registry.repository';

export class PostgresBanRegistryRepository implements BanRegistryRepository {
	async findById(id: number): Promise<ResultType<BanRegistry>> {
		const registries = await db.select().from(banRegistry).where(eq(banRegistry.id, id));

		const registry = registries[0];

		if (!registry) {
			return Fail('Registry not found');
		}

		return Ok(registry);
	}

	async update(id: number, data: Partial<NewBanRegistry>): Promise<ResultType<BanRegistry>> {
		const updatedRegistries = await db
			.update(banRegistry)
			.set(data)
			.where(eq(banRegistry.id, id))
			.returning();

		const updatedRegistry = updatedRegistries[0];

		if (!updatedRegistry) {
			return Fail('Registry not found');
		}

		return Ok(updatedRegistry);
	}

	async create(data: NewBanRegistry): Promise<ResultType<BanRegistry>> {
		const newRegistry = await db.insert(banRegistry).values(data).returning();

		return Ok(newRegistry[0]);
	}
}
