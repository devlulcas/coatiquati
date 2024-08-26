'use server';

import { isAdminOrAbove, isAuthenticated } from '@/modules/auth/utils/is';
import { log } from '@/modules/logging/lib/pino';
import { fail, ok, wrapAsyncInResult, type Result } from '@/shared/lib/result';
import { revalidateTopics } from '../lib/revalidate-topic';
import { TopicRepository } from '../repositories/topic-repository';
import { newTopicSchema, type NewTopicSchema } from '../schemas/new-topic-schema';
import { type NewTopic } from '../types/topic';

export async function createTopicMutation(params: NewTopicSchema): Promise<Result<string>> {
  const { user } = await validateRequest();

  if (!isAuthenticated(session)) {
    return fail('Você precisa estar autenticado para criar um novo tópico.');
  }

  if (!isAdminOrAbove(session.user.role)) {
    return fail('Você precisa ser um administrador para criar um novo tópico.');
  }

  const validatedParams = newTopicSchema.safeParse(params);

  if (!validatedParams.success) {
    return fail('Parâmetros inválidos para criar um novo tópico.');
  }

  const newTopic: NewTopic = {
    authorId: session.user.id,
    trailId: validatedParams.data.trailId,
    title: validatedParams.data.title,
    description: validatedParams.data.description,
  };

  const topicRepository = new TopicRepository();
  const topicResult = await wrapAsyncInResult(topicRepository.createTopic(newTopic));

  if (topicResult.type === 'fail') {
    log.error('Falha ao criar um novo tópico.', topicResult.fail);
    return fail('Falha ao criar um novo tópico.');
  }

  revalidateTopics({
    username: session.user.username,
    trailId: newTopic.trailId,
  });

  return ok('Tópico criado com sucesso.');
}
