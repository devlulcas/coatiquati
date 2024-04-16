'use server';

import { getPageSession } from '@/modules/auth/utils/get-page-session';
import { isAdminOrAbove } from '@/modules/auth/utils/is';
import { wrapAsyncInResult, type Result } from '@/shared/lib/result';
import { TopicRepository } from '../repositories/topic-repository';
import type { TopicWithContentArray } from '../types/topic';

export async function getTopicQuery(topicId: number): Promise<Result<TopicWithContentArray>> {
  const topicRepository = new TopicRepository();
  const session = await getPageSession();
  return wrapAsyncInResult(topicRepository.getTopicWithContentArray(topicId, isAdminOrAbove(session?.user.role)));
}
