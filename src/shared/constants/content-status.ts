export const contentStatus = {
  DRAFT: 'DRAFT',
  PUBLISHED: 'PUBLISHED',
} as const;

export type ContentStatus = (typeof contentStatus)[keyof typeof contentStatus];
