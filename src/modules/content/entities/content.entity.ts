import type { ContentUrlType } from '../value-objects/content-url';

export type TextContent = 'rich_text' | 'markdown' | 'html';

export type ContentType = TextContent | ContentUrlType;

export type Content = {
	id: string;
	title: string;
	body: string;
	type: ContentType;
	crumbId: string;
	originalBody: string;
};

export type ContentPreview = Omit<Content, 'body' | 'originalBody'>;

export type CreatableContent = Omit<Content, 'id'>;

export type ContentWithUnprocessedBody = Omit<CreatableContent, 'body'> & {
	id?: string;
};

export type ContentWithoutUnprocessedBody = Omit<Content, 'originalBody'>;
