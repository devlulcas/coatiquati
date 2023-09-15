import type {
  ContentFileTable,
  ContentHtmlTable,
  ContentImageTable,
  ContentTable,
  NewContentFileTable,
  NewContentHtmlTable,
  NewContentImageTable,
  NewContentTable,
} from '@/modules/database/schema/content';
import type { Creatable, Updatable } from '@/modules/database/types/utils';
import type { Contributor } from '@/modules/user/types/user';

type BaseContent = Omit<ContentTable, 'authorId' | 'contentType'> & {
  author: Contributor;
  contributors: Contributor[];
};

export type Content =
  | (BaseContent & {
      contentType: 'image';
      content: ContentImageTable;
    })
  | (BaseContent & {
      contentType: 'html';
      content: ContentHtmlTable;
    })
  | (BaseContent & {
      contentType: 'file';
      content: ContentFileTable;
    });

export type NewContent = Creatable<NewContentTable>;
export type UpdateContent = Omit<
  Updatable<ContentTable>,
  'authorId' | 'contentType'
>;

export type ContentFile = ContentFileTable;
export type NewContentFile = Creatable<NewContentFileTable>;
export type UpdateContentFile = Updatable<ContentFileTable>;

export type ContentHtml = ContentHtmlTable;
export type NewContentHtml = Creatable<NewContentHtmlTable>;
export type UpdateContentHtml = Updatable<ContentHtmlTable>;

export type ContentImage = ContentImageTable;
export type NewContentImage = Creatable<NewContentImageTable>;
export type UpdateContentImage = Updatable<ContentImageTable>;
