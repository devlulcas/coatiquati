import type { ContentPreview, ContentType } from './content.entity';

export type Crumb = {
	id: string;
	title: string;
	description: string;
	contentTypeAvailable: ContentType[];
	contents: ContentPreview[];
	trailId: string;
};

export type CrumbPreview = Omit<Crumb, 'contents'>;

export type CreatableCrumb = Omit<Crumb, 'id' | 'contents'>;

export type UpdatableCrumb = Partial<Omit<Crumb, 'contents'>>;
