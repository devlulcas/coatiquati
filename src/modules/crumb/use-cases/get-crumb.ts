import type { Crumb } from '../entities/crumbs.entity';
import type { CrumbRepositoryInterface } from '../repositories/crumbs.repository';

export class GetCrumb {
	constructor(private crumbRepository: CrumbRepositoryInterface) {}

	public async execute(id: string): Promise<Crumb | null> {
		const crumb = await this.crumbRepository.findById(id);

		if (!crumb) {
			throw new Error('No crumb found');
		}

		return crumb;
	}
}
