import { log } from '$lib/server/log';
import { Ok, type ResultType } from '$lib/types/result';
import type { TrailsSearchSchema } from '../dtos/trails-search';
import type { TrailRepository } from '../repositories/trail.repository';
import type { Trail } from '../types/trail';

export class GetTrails {
	constructor(private trailRepository: TrailRepository) {}

	async execute(data: TrailsSearchSchema = {}): Promise<ResultType<Trail[]>> {
		const trailPreviewsResult = await this.trailRepository.findMany(data);

		if (trailPreviewsResult.error) {
			log.error(trailPreviewsResult.error, `Error getting trails`);
			return trailPreviewsResult;
		}

		const trails: Trail[] = trailPreviewsResult.data.map((trail) => ({
			...trail,
			contributors: []
		}));

		return Ok(trails);
	}
}
