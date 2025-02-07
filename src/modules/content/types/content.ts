import type { ContentSelect } from '@/modules/database/schema/content';
import type { Creatable, Updatable } from '@/modules/database/types/utils';
import type { Contributor } from '@/modules/user/types/user';
import type { ImageContentJSON, RichTextContentJSON, VideoContentJSON } from './content-json-field';

export type RawBaseContent = ContentSelect

export type BaseContent = Omit<ContentSelect, 'authorId' | 'contentType' | 'topicId'> & {
  author: Contributor;
  contributors: { user: Contributor }[];
};

export type ImageContent = BaseContent & {
  contentType: 'image';
  content: ImageContentJSON
};

export type RichTextContent = BaseContent & {
  contentType: 'richText';
  content: RichTextContentJSON
};

export type VideoContent = BaseContent & {
  contentType: 'video';
  content: VideoContentJSON
};

export type Content = ImageContent | RichTextContent | VideoContent
export type NewContent = Creatable<Content>;
export type UpdateContent = Omit<Updatable<Content>, 'author' | 'contentType'> & {
  contributorId: Content['author']['id'];
};
