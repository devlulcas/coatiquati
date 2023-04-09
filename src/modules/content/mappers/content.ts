import type {
	Content,
	ContentPreview,
	ContentWithoutUnprocessedBody
} from '../entities/content.entity';

export class ContentMapper {
	public static toContentWithoutUnprocessedBody(content: Content): ContentWithoutUnprocessedBody {
		return {
			id: content.id,
			title: content.title,
			type: content.type,
			crumbId: content.crumbId,
			body: content.body
		};
	}

	public static toContentPreview(content: Content): ContentPreview {
		return {
			id: content.id,
			title: content.title,
			type: content.type,
			crumbId: content.crumbId
		};
	}
}
