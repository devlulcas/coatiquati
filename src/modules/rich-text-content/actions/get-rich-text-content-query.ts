'use server';

import { RichTextContentRepository } from '@/modules/rich-text-content/repositories/rich-text-content-repository';

export async function getRichTextContentQuery(baseContentId: number) {
  const richTextContentRepository = new RichTextContentRepository();
  return richTextContentRepository.getByContentId(baseContentId);
}
