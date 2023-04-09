import type { Content } from '../entities/content.entity';
import type { ContentRepositoryInterface } from '../repositories/content.repository';

export class GetRawContent {
	constructor(private contentRepository: ContentRepositoryInterface) {}

	public async execute(id: string): Promise<Content> {
		return this.contentRepository.findRawById(id);
	}
}
