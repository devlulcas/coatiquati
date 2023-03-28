export type TextContent = 'rich_text' | 'markdown' | 'html';

export type ContentType = TextContent | 'image' | 'video' | 'link';

export type Content = {
	id: string;
	title: string;
	body: string;
	type: ContentType;
	crumbId: string;
};

export type ContentPreview = Omit<Content, 'body'>;

export type CreatableContent = Omit<Content, 'id'>;
