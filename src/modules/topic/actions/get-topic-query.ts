'use server';

import { getActionSession } from '@/modules/auth/utils/get-action-session';
import { isAdminOrAbove } from '@/modules/auth/utils/is';
import { TopicRepository } from '../repositories/topic-repository';
import type { TopicWithContentArray } from '../types/topic';

export async function getTopicQuery(topicId: number): Promise<TopicWithContentArray> {
  const topicRepository = new TopicRepository();
  const session = await getActionSession();
  return topicRepository.getTopicWithContentArray(topicId, isAdminOrAbove(session?.user.role));
}
