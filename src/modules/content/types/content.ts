import type { ContentStatus } from '@/modules/database/lib/content-enum';
import type { SelectImageContent, SelectRichTextContent, SelectVideoContent } from '@/modules/database/schema/content';
import type { Contributor } from '@/modules/user/types/user';

export type BaseContent = {
  id: number;
  title: string;
  description: string | null;
  status: ContentStatus;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
  author: Contributor;
  contributors: Contributor[];

  // pode ser qualquer um dos tipos abaixo
  imageContent?: Omit<SelectImageContent, 'contentId'>;
  richTextContent?: Omit<SelectRichTextContent, 'contentId'>;
  videoContent?: Omit<SelectVideoContent, 'contentId'>;
};

export type ImageContent = MakeRequired<BaseContent, 'imageContent'>;
export type RichTextContent = MakeRequired<BaseContent, 'richTextContent'>;
export type VideoContent = MakeRequired<BaseContent, 'videoContent'>;

type MakeRequired<T, K extends keyof T> = T & { [P in K]-?: T[P] };
export function isRequired<T, K extends keyof T>(input: T, key: K): input is MakeRequired<T, K> {
  return input[key] !== null && input[key] !== undefined;
}
