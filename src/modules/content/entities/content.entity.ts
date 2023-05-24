export const UrlContentTypes = ['video', 'image', 'audio', 'document'] as const;

export const TextContentTypes = ['rich_text', 'markdown' , 'html'] as const;

export const ContentTypes = [...UrlContentTypes, ...TextContentTypes] as const;

export type UrlContentType = typeof UrlContentTypes[number];

export type TextContent = typeof TextContentTypes[number];

export type ContentType = typeof ContentTypes[number];

export type Content = {
	id: string;
	title: string;
	body: string;
	type: ContentType;
	crumbId: string;
	originalBody: string;
};

