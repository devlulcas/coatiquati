'use server';

import { validateRequest } from '@/modules/auth/services/next';
import { isAdminOrAbove } from '@/modules/auth/utils/is';
import { wrapAsyncInResult, type Result } from '@/shared/lib/result';
import { TopicRepository } from '../repositories/topic-repository';
import type { TopicWithContentArray } from '../types/topic';

export async function getTopicQuery(topicId: number): Promise<Result<TopicWithContentArray>> {
  const topicRepository = new TopicRepository();
  const { data: user } = await validateRequest();
  return wrapAsyncInResult(topicRepository.getTopicWithContentArray(topicId, isAdminOrAbove(user?.role)));
}
