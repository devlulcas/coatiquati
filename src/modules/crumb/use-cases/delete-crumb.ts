import type { CrumbRepositoryInterface } from '../repositories/crumbs.repository';

export class DeleteCrumb {
	constructor(private crumbRepository: CrumbRepositoryInterface) {}

	public async execute(id: string): Promise<void> {
		const crumb = await this.crumbRepository.findById(id);

		if (!crumb) {
			throw new Error('No crumb found');
		}

		await this.crumbRepository.delete(id);
	}
}
