import type { TrailRepositoryInterface } from '$src/modules/trail/repositories/trail.repository';
import type { CrumbPreview, UpdatableCrumb } from '../entities/crumbs.entity';
import { CrumbMapper } from '../mappers/crumb.mapper';
import type { CrumbRepositoryInterface } from '../repositories/crumbs.repository';

export class CreateCrumb {
	constructor(
		private readonly crumbRepository: CrumbRepositoryInterface,
		private readonly trailRepository: TrailRepositoryInterface
	) {}

	public async execute(data: UpdatableCrumb): Promise<CrumbPreview | null> {
    if (!data.id) {
      throw new Error('No trailId found');
    }

    // Check if trail exists when trying to change the crumb from trail to another trail
    if (data.trailId) {
      const trail = await this.trailRepository.findById(data.trailId);
      
      if (!trail) {
        throw new Error('No trail found');
      }
    }

		const updatedCrumb = await this.crumbRepository.update(data);

		return CrumbMapper.toDTO(updatedCrumb);
	}
}
