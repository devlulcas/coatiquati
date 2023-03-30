import type { Trail, UpdatableTrail } from '../entities/trail.entity';
import type { TrailRepositoryInterface } from '../repositories/trail.repository';

export class UpdateTrail {
	constructor(private trailRepository: TrailRepositoryInterface) {}

	async execute(trail: UpdatableTrail): Promise<Trail> {
		const updatedTrail = await this.trailRepository.update(trail);

		if (!updatedTrail) {
			throw new Error('No trail found');
		}

		return updatedTrail;
	}
}
