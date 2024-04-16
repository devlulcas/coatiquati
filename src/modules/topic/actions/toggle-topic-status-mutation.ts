'use server';

import { getActionSession } from '@/modules/auth/utils/get-action-session';
import { isAdminOrAbove, isAuthenticated } from '@/modules/auth/utils/is';
import { log } from '@/modules/logging/lib/pino';
import { asyncResult, fail, ok, type Result } from '@/shared/lib/result';
import { revalidateTopics } from '../lib/revalidate-topic';
import { TopicRepository } from '../repositories/topic-repository';

export async function toggleTopicStatusMutation(topicId: number): Promise<Result<string>> {
  const session = await getActionSession();

  if (!isAuthenticated(session)) {
    return fail('Usuário não autenticado.');
  }

  if (!isAdminOrAbove(session.user.role)) {
    return fail('Somente administradores podem editar tópicos.');
  }

  const topicRepository = new TopicRepository();

  const topicResult = await asyncResult(topicRepository.getTopicById(topicId, true));

  if (topicResult.type === 'fail') {
    log.error('Falha ao buscar tópico.', topicResult.fail);
    return fail('Falha ao buscar tópico.');
  }

  if (topicResult.value.status === 'PUBLISHED') {
    topicRepository.omitTopic(topicId);
  } else if (topicResult.value.status === 'DRAFT') {
    topicRepository.enableTopic(topicId);
  } else {
    return fail('Status inválido para tópico.');
  }

  revalidateTopics({
    username: session.user.username,
    trailId: topicResult.value.trailId,
    topicId: topicResult.value.id,
  });

  return ok('Status do tópico alterado com sucesso.');
}
