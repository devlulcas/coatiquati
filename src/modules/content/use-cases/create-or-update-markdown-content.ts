import type { ContentWithUnprocessedBody, CreatableContent } from '../entities/content.entity';
import type { ContentRepositoryInterface } from '../repositories/content.repository';
import { micromark } from 'micromark';
import { gfm, gfmHtml } from 'micromark-extension-gfm';

export class CreateOrUpdateMarkdownContent {
	constructor(private contentRepository: ContentRepositoryInterface) {}

	public async execute(data: ContentWithUnprocessedBody): Promise<void> {
		const body = micromark(data.originalBody, {
			extensions: [gfm()],
			htmlExtensions: [gfmHtml()]
		});

		const content = {
			...data,
			type: 'markdown',
			body: body
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
