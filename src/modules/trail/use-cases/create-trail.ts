import { slugify } from '$src/shared/utils/slugify';
import type { CreatableTrailWithoutSlugDTO } from '../dtos/trail.dto';
import type { Trail } from '../entities/trail.entity';
import type { TrailRepositoryInterface } from '../repositories/trail.repository';

export class CreateTrail {
	constructor(private trailRepository: TrailRepositoryInterface) {}

	async execute(data: CreatableTrailWithoutSlugDTO): Promise<Trail> {
		const slug = slugify(data.title);

		const createdTrail = await this.trailRepository.create({
			...data,
			slug: slug
		});

		return createdTrail;
	}
}
