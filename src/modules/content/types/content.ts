import type {
  ContentImageTable,
  ContentRichTextTable,
  ContentTable,
  ContentVideoTable,
  NewContentImageTable,
  NewContentRichTextTable,
  NewContentTable,
  NewContentVideoTable,
} from '@/modules/database/schema/content';
import type { Creatable, Updatable } from '@/modules/database/types/utils';
import type { Contributor } from '@/modules/user/types/user';

type UpdatableContent<T> = Partial<Omit<T, 'createdAt'>> & {
  contentId: T extends { id: infer U } ? U : never;
  updatedAt: string;
};

export type BaseContent = Omit<ContentTable, 'authorId' | 'contentType' | 'topicId'> & {
  author: Contributor;
  contributors: { user: Contributor }[];
};

export type ContentWithImage = BaseContent & {
  contentType: 'image';
  content: ContentImageTable;
};

export type ContentWithRichText = BaseContent & {
  contentType: 'rich_text';
  content: ContentRichText;
};

export type ContentWithRichTextPreview = BaseContent & {
  contentType: 'rich_text';
  content: ContentRichTextPreview;
};

export type ContentWithVideo = BaseContent & {
  contentType: 'video';
  content: ContentVideoTable;
};

export type Content =  ContentWithImage | ContentWithRichTextPreview | ContentWithVideo;
export type NewContent = Creatable<NewContentTable>;
export type UpdateContent = Omit<Updatable<ContentTable>, 'authorId' | 'contentType'> & {
  contributorId: ContentTable['authorId'];
};

export type ContentRichTextPreview = Omit<ContentRichTextTable, 'asJson'>;
export type ContentRichText = Omit<ContentRichTextTable, 'previewAsJson'>;
export type NewContentRichText = Omit<Creatable<NewContentRichTextTable>, 'previewAsJson'>;
export type UpdateContentRichText = Omit<UpdatableContent<ContentRichTextTable>, 'previewAsJson'> & {
  contributorId: ContentTable['authorId'];
};

export type ContentImage = ContentImageTable;
export type NewContentImage = Omit<Creatable<NewContentImageTable>, 'contentId'>;
export type UpdateContentImage = Omit<UpdatableContent<ContentImageTable>, 'contentId' | 'updatedAt'>;

export type ContentVideo = ContentVideoTable;
export type NewContentVideo = Omit<Creatable<NewContentVideoTable>, 'contentId'>;
export type UpdateContentVideo = Omit<UpdatableContent<ContentVideoTable>, 'contentId' | 'updatedAt'>;
