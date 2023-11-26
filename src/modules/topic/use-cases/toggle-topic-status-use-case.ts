import type { Session } from '@/modules/auth/types/session';
import { isAdminOrAbove } from '@/modules/auth/utils/is';
import { TopicRepository } from '../repositories/topic-repository';
import { topicWithIdSchema, type TopicWithIdSchema } from '../schemas/topic-with-id-schema';

export class ToggleTopicStatusUseCase {
  constructor(private readonly topicRepository: TopicRepository = new TopicRepository()) {}

  async execute(params: TopicWithIdSchema, session: Session) {
    if (!isAdminOrAbove(session.user.role)) {
      throw new Error('Somente administradores podem editar tópicos.');
    }

    const validatedParams = topicWithIdSchema.safeParse(params);

    if (!validatedParams.success) {
      throw new Error('Parâmetros inválidos para editar tópico.');
    }

    const topic = await this.topicRepository.getTopicById(validatedParams.data.id);

    if (topic.status === 'PUBLISHED') {
      return this.topicRepository.omitTopic(validatedParams.data.id);
    } else if (topic.status === 'DRAFT') {
      return this.topicRepository.enableTopic(validatedParams.data.id);
    }

    throw new Error('Status inválido para tópico.');
  }
}
