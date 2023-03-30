import type { TrailRepositoryInterface } from '../repositories/trail.repository';

export class DeleteTrail {
	constructor(private trailRepository: TrailRepositoryInterface) {}

	async execute(id: string): Promise<string> {
		const trail = await this.trailRepository.findById(id);

		if (!trail) {
			throw new Error('No trail found');
		}

		try {
			await this.trailRepository.delete(trail.id);
			return `Trail "${trail.title}" with id "${trail.id}" deleted successfully`;
		} catch (e) {
			throw new Error('Error deleting trail');
		}
	}
}
