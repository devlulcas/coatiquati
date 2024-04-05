'use server';

import { getActionSession } from '@/modules/auth/utils/get-action-session';
import { isAdminOrAbove, isAuthenticated } from '@/modules/auth/utils/is';
import { log } from '@/modules/logging/lib/pino';
import { revalidateTopics } from '../lib/revalidate-topic';
import { TopicRepository } from '../repositories/topic-repository';
import { updateTopicSchema, type UpdateTopicSchema } from '../schemas/edit-topic-schema';
import { type UpdateTopic } from '../types/topic';

export async function updateTopicMutation(params: UpdateTopicSchema): Promise<void> {
  const session = await getActionSession();

  if (!isAuthenticated(session)) {
    throw new Error('Você precisa estar autenticado para atualizar um tópico.');
  }

  if (!isAdminOrAbove(session.user.role)) {
    throw new Error('Você precisa ser um administrador para atualizar um tópico.');
  }

  const validatedParams = updateTopicSchema.safeParse(params);

  if (!validatedParams.success) {
    throw new Error('Parâmetros inválidos para atualizar um tópico.');
  }

  const updatedTopic: UpdateTopic = {
    contributorId: session.userId,
    id: validatedParams.data.id,
    title: validatedParams.data.title,
    description: validatedParams.data.description,
    thumbnail: validatedParams.data.thumbnail,
    status: validatedParams.data.status,
    trailId: validatedParams.data.trailId,
  };

  const topicRepository = new TopicRepository();
  const topic = await topicRepository.updateTopic(updatedTopic);

  revalidateTopics({
    username: session.user.username,
    trailId: validatedParams.data.trailId,
    topicId: validatedParams.data.id,
  });

  log.info('Tópico atualizado', topic);
}
