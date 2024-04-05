'use server';

import { getActionSession } from '@/modules/auth/utils/get-action-session';
import { isAdminOrAbove, isAuthenticated } from '@/modules/auth/utils/is';
import { revalidateTopics } from '../lib/revalidate-topic';
import { TopicRepository } from '../repositories/topic-repository';

export async function toggleTopicStatusMutation(topicId: number) {
  const session = await getActionSession();

  if (!isAuthenticated(session)) {
    throw new Error('Usuário não autenticado.');
  }

  if (!isAdminOrAbove(session.user.role)) {
    throw new Error('Somente administradores podem editar tópicos.');
  }

  const topicRepository = new TopicRepository();

  const topic = await topicRepository.getTopicById(topicId, true);

  if (topic.status === 'PUBLISHED') {
    topicRepository.omitTopic(topicId);
  } else if (topic.status === 'DRAFT') {
    topicRepository.enableTopic(topicId);
  } else {
    throw new Error('Status inválido para tópico.');
  }

  revalidateTopics({ username: session.user.username, trailId: topic.trailId, topicId: topic.id });
}
