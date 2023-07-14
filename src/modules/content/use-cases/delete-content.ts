import type { ContentRepositoryInterface } from '../repositories/content.repository';

export class DeleteContent {
	constructor(private contentRepository: ContentRepositoryInterface) {}

	public async execute(id: string): Promise<void> {
		return this.contentRepository.delete(id);
	}
}
