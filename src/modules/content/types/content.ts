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

export type Content = ContentTable;
export type NewContent = NewContentTable;
export type ContentFile = ContentFileTable;
export type NewContentFile = NewContentFileTable;
export type ContentHtml = ContentHtmlTable;
export type NewContentHtml = NewContentHtmlTable;
export type ContentImage = ContentImageTable;
export type NewContentImage = NewContentImageTable;
