'use server';

import { getActionSession } from '@/modules/auth/utils/get-action-session';
import { isAdminOrAbove, isAuthenticated } from '@/modules/auth/utils/is';
import { log } from '@/modules/logging/lib/pino';
import { asyncResult, fail, ok, type Result } from '@/shared/lib/result';
import { revalidateTopics } from '../lib/revalidate-topic';
import { TopicRepository } from '../repositories/topic-repository';
import { updateTopicSchema, type UpdateTopicSchema } from '../schemas/edit-topic-schema';
import { type UpdateTopic } from '../types/topic';

export async function updateTopicMutation(params: UpdateTopicSchema): Promise<Result<string>> {
  const session = await getActionSession();

  if (!isAuthenticated(session)) {
    return fail('Você precisa estar autenticado para atualizar um tópico.');
  }

  if (!isAdminOrAbove(session.user.role)) {
    return fail('Você precisa ser um administrador para atualizar um tópico.');
  }

  const validatedParams = updateTopicSchema.safeParse(params);

  if (!validatedParams.success) {
    return fail('Parâmetros inválidos para atualizar um tópico.');
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
  const topicResult = await asyncResult(topicRepository.updateTopic(updatedTopic));

  if (topicResult.type === 'fail') {
    log.error('Falha ao atualizar um tópico.', topicResult.fail);
    return fail('Falha ao atualizar um tópico.');
  }

  revalidateTopics({
    username: session.user.username,
    trailId: validatedParams.data.trailId,
    topicId: validatedParams.data.id,
  });

  return ok('Tópico atualizado com sucesso.');
}
