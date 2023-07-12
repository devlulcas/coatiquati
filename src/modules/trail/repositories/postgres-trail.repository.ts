import { db } from '$lib/server/db';
import { Fail, Ok, type ResultType } from '$lib/types/result';
import { desc, eq } from 'drizzle-orm';
import type { GetTrailsDTO } from '../dtos/get-trails.dto';
import { trail, type NewTrail, type Trail, type TrailId } from '../schemas/trail';
import type { TrailPreviewDPO, TrailRepository, UpdateTrailDPO } from './trail.repository';

export class PostgresTrailRepository implements TrailRepository {
	async findById(id: TrailId): Promise<ResultType<Trail>> {
		const trails = await db.select().from(trail).where(eq(trail.id, id));

		const firstTrail = trails[0];

		if (!firstTrail) {
			return Fail('Trilha não encontrada');
		}

		return Ok(firstTrail);
	}

	// TODO: Finalizar implementação
	async findMany(params: GetTrailsDTO): Promise<ResultType<TrailPreviewDPO[]>> {
		const trails = await db.select().from(trail).where(eq(trail.active, true)).orderBy(desc(trail.updatedAt));

		if (trails.length === 0) {
			return Fail('Nenhuma trilha encontrada');
		}

		const trailPreviews = trails.map((trail) => ({
			id: trail.id,
			title: trail.title,
			description: trail.description,
			contributors: [],
			thumbnail: trail.thumbnail,
			thumbnailDescription: trail.thumbnailDescription,
			updatedAt: trail.updatedAt
		}));

		return Ok(trailPreviews);
	}

	async create(data: NewTrail): Promise<ResultType<TrailPreviewDPO>> {
		try {
			const newTrail = (await db.insert(trail).values(data).returning())[0];

			return Ok({
				id: newTrail.id,
				title: newTrail.title,
				description: newTrail.description,
				contributors: [],
				thumbnail: newTrail.thumbnail,
				thumbnailDescription: newTrail.thumbnailDescription,
				updatedAt: newTrail.updatedAt
			});
		} catch (error) {
			return Fail('not impl');
		}
	}

	async update(data: UpdateTrailDPO): Promise<ResultType<Trail>> {
		return Fail('not impl');
	}
}
