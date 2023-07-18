import { log } from '$lib/server/log';
import type { ResultType } from '$lib/types/result';
import type { UpdateTrailSchema } from '../dtos/update-trail.dto';
import type { TrailRepository } from '../repositories/trail.repository';
import type { Trail } from '../types/trail';

export class UpdateTrail {
	constructor(
		private trailRepository: TrailRepository,
	) {}

	async execute(data: UpdateTrailSchema): Promise<ResultType<Trail>> {
		const trail = await this.trailRepository.findById(data.id);

		if (trail.error) return trail;

		const updatedTrail = await this.trailRepository.update({
			...trail.data,
			title: data.title,
			description: data.description,
		});

		if (updatedTrail.error) {
			log.error(updatedTrail.error, `Error updating trail ${data.id}`);
		} else {
			log.info(updatedTrail.data, `Updated trail ${data.id}`);
		}

		return updatedTrail;
	}
}
