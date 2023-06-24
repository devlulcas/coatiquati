import type { ContentPreview } from '$modules/content/dtos/content.dto';
import type { ContentType } from '$modules/content/entities/content.entity';

export type Crumb = {
	id: string;
	title: string;
	description: string;
	contentTypeAvailable: ContentType[];
	contents: ContentPreview[];
	trailId: string;
};
