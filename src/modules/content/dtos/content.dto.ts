import type { Content } from '../entities/content.entity';

export type ContentPreview = Omit<Content, 'body' | 'originalBody'>;

export type CreatableContent = Omit<Content, 'id'>;

export type ContentWithUnprocessedBody = Omit<CreatableContent, 'body'> & {
	id?: string;
};

export type ContentWithoutUnprocessedBody = Omit<Content, 'originalBody'>;
