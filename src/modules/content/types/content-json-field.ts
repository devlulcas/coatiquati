import type { JSONContent } from '@tiptap/core';

export type ImageContentJSON = {
  src: string;
  description: string;
};

export type RichTextContentJSON = JSONContent;

export type VideoContentJSON = {
  src: string;
  description: string;
};

export type ContentJSON = ImageContentJSON | RichTextContentJSON | VideoContentJSON;

export enum ContentType {
  Image = 'image',
  RichText = 'richText',
  Video = 'video',
}
