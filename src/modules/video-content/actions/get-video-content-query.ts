'use server';

import { VideoContentRepository } from '@/modules/video-content/repositories/video-content-repository';

export async function getVideoContentQuery(baseContentId: number) {
  const videoContentRepository = new VideoContentRepository();
  return videoContentRepository.getByContentId(baseContentId);
}
