import { log } from '$lib/server/log';
import type { ResultType } from '$lib/types/result';
import type { TrailRepository } from '../repositories/trail.repository';
import type { Trail } from '../schemas/trail';

export class DeleteTrail {
	constructor(private trailRepository: TrailRepository) {}

	async execute(id: string): Promise<ResultType<Trail>> {
		const deletedTrailResult = await this.trailRepository.update({ id, active: false });

		if (deletedTrailResult.error) {
			log.error(deletedTrailResult.error, `Error deleting trail ${id}`);
		} else {
			log.info(deletedTrailResult.data, `Deleted trail ${id}`);
		}

		return deletedTrailResult;
	}
}
