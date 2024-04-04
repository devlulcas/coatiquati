'use server';

import { ImageContentRepository } from '@/modules/image-content/repositories/image-content-repository';

export async function getImageContentQuery(baseContentId: number) {
  const imageContentRepository = new ImageContentRepository();
  return imageContentRepository.getByContentId(baseContentId);
}
