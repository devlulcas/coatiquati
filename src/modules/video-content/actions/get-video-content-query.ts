'use server';

import type { ContentVideoSelect } from '@/modules/database/schema/content';
import { VideoContentRepository } from '@/modules/video-content/repositories/video-content-repository';
import { wrapAsyncInResult, type Result } from '@/shared/lib/result';

export async function getVideoContentQuery(baseContentId: number): Promise<Result<ContentVideoSelect>> {
  const videoContentRepository = new VideoContentRepository();
  return wrapAsyncInResult(videoContentRepository.getByContentId(baseContentId));
}
