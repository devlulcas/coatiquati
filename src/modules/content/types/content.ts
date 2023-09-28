import type {
  ContentFileTable,
  ContentImageTable,
  ContentRichTextTable,
  ContentTable,
  ContentVideoTable,
  NewContentFileTable,
  NewContentImageTable,
  NewContentRichTextTable,
  NewContentTable,
  NewContentVideoTable,
} from '@/modules/database/schema/content';
import type { Creatable, Updatable } from '@/modules/database/types/utils';
import type { Contributor } from '@/modules/user/types/user';

export type BaseContent = Omit<ContentTable, 'authorId' | 'contentType' | 'topicId'> & {
  author: Contributor;
  contributors: { user: Contributor }[];
};

export type ContentWithFile = BaseContent & {
  contentType: 'file';
  content: ContentFileTable;
};

export type ContentWithImage = BaseContent & {
  contentType: 'image';
  content: ContentImageTable;
};

export type ContentWithRichText = BaseContent & {
  contentType: 'rich_text';
  content: ContentRichTextTable;
};

export type ContentWithRichTextPreview = BaseContent & {
  contentType: 'rich_text';
  content: ContentRichTextPreview;
};

export type ContentWithVideo = BaseContent & {
  contentType: 'video';
  content: ContentVideoTable;
};

export type Content =
  | ContentWithFile
  | ContentWithImage
  | ContentWithRichTextPreview
  | ContentWithVideo;

export type NewContent = Creatable<NewContentTable>;
export type UpdateContent = Omit<Updatable<ContentTable>, 'authorId' | 'contentType'>;

export type ContentFile = ContentFileTable;
export type NewContentFile = Creatable<NewContentFileTable>;
export type UpdateContentFile = Updatable<ContentFileTable>;

export type ContentRichTextPreview = Omit<ContentRichTextTable, 'asJson'>;
export type ContentRichText = Omit<ContentRichTextTable, 'previewAsJson'>;
export type NewContentRichText = Creatable<NewContentRichTextTable>;
export type UpdateContentRichText = Updatable<ContentRichTextTable>;

export type ContentImage = ContentImageTable;
export type NewContentImage = Creatable<NewContentImageTable>;
export type UpdateContentImage = Updatable<ContentImageTable>;

export type ContentVideo = ContentVideoTable;
export type NewContentVideo = Creatable<NewContentVideoTable>;
export type UpdateContentVideo = Updatable<ContentVideoTable>;
