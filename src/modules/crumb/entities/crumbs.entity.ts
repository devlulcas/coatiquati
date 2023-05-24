import type { ContentPreview } from '$src/modules/content/dtos/content.dto';
import type { ContentType } from '$src/modules/content/entities/content.entity';

export type Crumb = {
	id: string;
	title: string;
	description: string;
	contentTypeAvailable: ContentType[];
	contents: ContentPreview[];
	trailId: string;
};
