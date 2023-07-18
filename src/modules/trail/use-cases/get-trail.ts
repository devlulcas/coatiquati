import { log } from '$lib/server/log';
import type { ResultType } from '$lib/types/result';
import type { TrailRepository } from '../repositories/trail.repository';
import type { Trail } from '../types/trail';

export class GetTrail {
	constructor(private trailRepository: TrailRepository) {}

	async execute(id: string): Promise<ResultType<Trail>> {
		const trailResult = await this.trailRepository.findById(id);

		if (trailResult.error) {
			log.error(trailResult.error, `Error getting trail ${id}`);
		}

		return trailResult;
	}
}
