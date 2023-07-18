import { db } from '$lib/server/db';
import { getLimitAndOffset } from '$lib/types/pagination';
import { Fail, Ok, type ResultType } from '$lib/types/result';
import { desc, eq } from 'drizzle-orm';
import type { TrailsSearchSchema } from '../dtos/trails-search';
import { trailTable } from '../schemas/trail';
import type { Trail, TrailId } from '../types/trail';
import type { NewTrailPersinstance, TrailRepository, UpdateTrailPersinstance } from './trail.repository';

export class PostgresTrailRepository implements TrailRepository {
	async findById(id: TrailId): Promise<ResultType<Trail>> {
		const trail = (await db.select().from(trailTable).where(eq(trailTable.id, id)))[0];

		if (!trail) {
			return Fail('Trilha não encontrada');
		}

		const firstTrail = { ...trail, contributors: [] };

		return Ok(firstTrail);
	}

	async findMany(params: TrailsSearchSchema): Promise<ResultType<Trail[]>> {
		const pagination = getLimitAndOffset(params);

		const trails = await db
			.select()
			.from(trailTable)
			.where(eq(trailTable.active, true))
			.limit(pagination.limit)
			.offset(pagination.offset)
			.orderBy(desc(params.orderBy === 'updated_at' ? trailTable.updatedAt : trailTable.createdAt));

		if (trails.length === 0) {
			return Fail('Nenhuma trilha encontrada');
		}

		return Ok(trails.map((trail) => ({ ...trail, contributors: [] })));
	}

	async create(data: NewTrailPersinstance): Promise<ResultType<Trail>> {
		try {
			const newTrail = (await db.insert(trailTable).values(data).returning())[0];

			const trail = {
				...newTrail,
				contributors: []
			};

			return Ok(trail);
		} catch (error) {
			return Fail('not impl');
		}
	}

	async update(data: UpdateTrailPersinstance): Promise<ResultType<Trail>> {
		const updatedTrail = (await db.update(trailTable).set(data).where(eq(trailTable.id, data.id)).returning())[0];

		const trail = {
			...updatedTrail,
			contributors: []
		};

		return Ok(trail);
	}
}
