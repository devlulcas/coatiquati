import type { ContentWithUnprocessedBody, CreatableContent } from '../dtos/content.dto';
import type { ContentRepositoryInterface } from '../repositories/content.repository';
import { ContentUrl } from '../value-objects/content-url';

export class CreateOrUpdateUrlContent {
	constructor(private contentRepository: ContentRepositoryInterface) {}

	public async execute(data: ContentWithUnprocessedBody): Promise<void> {
		const getUrlContent = () => {
			try {
				return ContentUrl.create(data.originalBody);
			} catch (error) {
				return null;
			}
		};

		const urlContent = getUrlContent();

		if (!urlContent) {
			throw new Error('Invalid URL');
		}

		const content = {
			...data,
			type: urlContent.type,
			body: urlContent.url
		} satisfies CreatableContent;

		if (data.id) {
			await this.contentRepository.update({
				...content,
				id: data.id
			});
		} else {
			await this.contentRepository.create(content);
		}
	}
}
