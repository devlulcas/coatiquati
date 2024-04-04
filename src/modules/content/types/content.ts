import type {
  ContentImageInsert,
  ContentImageSelect,
  ContentInsert,
  ContentRichTextInsert,
  ContentRichTextSelect,
  ContentSelect,
  ContentVideoInsert,
  ContentVideoSelect,
} from '@/modules/database/schema/content';
import type { Creatable, Updatable } from '@/modules/database/types/utils';
import type { Contributor } from '@/modules/user/types/user';

type UpdatableContent<T> = Partial<Omit<T, 'createdAt'>> & {
  contentId: T extends { id: infer U } ? U : never;
  updatedAt: string;
};

export type BaseContent = Omit<ContentSelect, 'authorId' | 'contentType' | 'topicId'> & {
  author: Contributor;
  contributors: { user: Contributor }[];
};

export type ContentWithImage = BaseContent & {
  contentType: 'image';
  content: ContentImageSelect;
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
  content: ContentVideoSelect;
};

export type Content = ContentWithImage | ContentWithRichTextPreview | ContentWithVideo;
export type NewContent = Creatable<ContentInsert>;
export type UpdateContent = Omit<Updatable<ContentSelect>, 'authorId' | 'contentType'> & {
  contributorId: ContentSelect['authorId'];
};

export type ContentRichTextPreview = Omit<ContentRichText, 'asJson'>;
export type ContentRichText = Omit<ContentRichTextSelect, 'previewAsJson'>;
export type NewContentRichText = Omit<Creatable<ContentRichTextInsert>, 'previewAsJson'>;
export type UpdateContentRichText = Omit<UpdatableContent<ContentRichText>, 'previewAsJson'> & {
  contributorId: ContentSelect['authorId'];
};

export type ContentImage = ContentImageSelect;
export type NewContentImage = Omit<Creatable<ContentImageInsert>, 'contentId'>;
export type UpdateContentImage = Omit<UpdatableContent<ContentImageSelect>, 'contentId' | 'updatedAt'>;

export type ContentVideo = ContentVideoSelect;
export type NewContentVideo = Omit<Creatable<ContentVideoInsert>, 'contentId'>;
export type UpdateContentVideo = Omit<UpdatableContent<ContentVideoSelect>, 'contentId' | 'updatedAt'>;
