import type { TrailRepositoryInterface } from '$src/modules/trail/repositories/trail.repository';
import type { CreatableCrumb, CrumbPreview } from '../entities/crumbs.entity';
import { CrumbMapper } from '../mappers/crumb.mapper';
import type { CrumbRepositoryInterface } from '../repositories/crumbs.repository';

export class CreateCrumb {
	constructor(
		private readonly crumbRepository: CrumbRepositoryInterface,
		private readonly trailRepository: TrailRepositoryInterface
	) {}

	public async execute(data: CreatableCrumb): Promise<CrumbPreview | null> {
		const trail = await this.trailRepository.findById(data.trailId);

		if (!trail) {
			throw new Error('No trail found');
		}

		const createdCrumb = await this.crumbRepository.create(data);

		return CrumbMapper.toDTO(createdCrumb);
	}
}
