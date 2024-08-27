'use server';

import { validateRequest } from '@/modules/auth/services/lucia';
import { isAdminOrAbove, isAuthenticated } from '@/modules/auth/utils/is';
import { log } from '@/modules/logging/lib/pino';
import { fail, isFail, ok, wrapAsyncInResult, type Result } from '@/shared/lib/result';
import { revalidateTopics } from '../lib/revalidate-topic';
import { TopicRepository } from '../repositories/topic-repository';
import { updateTopicSchema, type UpdateTopicSchema } from '../schemas/edit-topic-schema';
import { type UpdateTopic } from '../types/topic';

export async function updateTopicMutation(params: UpdateTopicSchema): Promise<Result<string>> {
  const { user } = await validateRequest();

  if (!isAuthenticated(user)) {
    return fail('Você precisa estar autenticado para atualizar um tópico.');
  }

  if (!isAdminOrAbove(user.role)) {
    return fail('Você precisa ser um administrador para atualizar um tópico.');
  }

  const validatedParams = updateTopicSchema.safeParse(params);

  if (!validatedParams.success) {
    return fail('Parâmetros inválidos para atualizar um tópico.');
  }

  const updatedTopic: UpdateTopic = {
    contributorId: user.id,
    id: validatedParams.data.id,
    title: validatedParams.data.title,
    description: validatedParams.data.description,
    thumbnail: validatedParams.data.thumbnail,
    status: validatedParams.data.status,
    trailId: validatedParams.data.trailId,
  };

  const topicRepository = new TopicRepository();
  const topicResult = await wrapAsyncInResult(topicRepository.updateTopic(updatedTopic));

  if (isFail(topicResult)) {
    log.error('Falha ao atualizar um tópico.', topicResult.fail);
    return fail('Falha ao atualizar um tópico.');
  }

  revalidateTopics({
    username: user.username,
    trailId: validatedParams.data.trailId,
    topicId: validatedParams.data.id,
  });

  return ok('Tópico atualizado com sucesso.');
}
