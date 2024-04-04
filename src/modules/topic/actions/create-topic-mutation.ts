'use server';

import { getActionSession } from '@/modules/auth/utils/get-action-session';
import { isAdminOrAbove, isAuthenticated } from '@/modules/auth/utils/is';
import { log } from '@/modules/logging/lib/pino';
import { revalidateTopics } from '../lib/revalidate-topic';
import { TopicRepository } from '../repositories/topic-repository';
import { newTopicSchema, type NewTopicSchema } from '../schemas/new-topic-schema';
import { type NewTopic } from '../types/topic';

export async function createTopicMutation(params: NewTopicSchema): Promise<void> {
  const session = await getActionSession();

  if (!isAuthenticated(session)) {
    throw new Error('Você precisa estar autenticado para criar um novo tópico.');
  }

  if (!isAdminOrAbove(session.user.role)) {
    throw new Error('Você precisa ser um administrador para criar um novo tópico.');
  }

  const validatedParams = newTopicSchema.safeParse(params);

  if (!validatedParams.success) {
    throw new Error('Parâmetros inválidos para criar um novo tópico.');
  }

  const newTopic: NewTopic = {
    authorId: session.user.id,
    trailId: validatedParams.data.trailId,
    title: validatedParams.data.title,
    description: validatedParams.data.description,
  };

  const topicRepository = new TopicRepository();
  const topic = await topicRepository.createTopic(newTopic);

  log.info('Novo tópico criado', topic);

  revalidateTopics({
    username: session.user.username,
    trailId: newTopic.trailId,
  });
}
