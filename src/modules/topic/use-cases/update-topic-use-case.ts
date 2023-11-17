import type { Session } from '@/modules/auth/types/session';
import { isAdminOrAbove } from '@/modules/auth/utils/is';
import { log } from '@/modules/logging/lib/pino';
import { TopicRepository } from '../repositories/topic-repository';
import { updateTopicUseCaseSchema, type UpdateTopicSchema } from '../schemas/edit-topic-schema';
import { type Topic, type UpdateTopic } from '../types/topic';

export class UpdateTopicUseCase {
  constructor(private readonly topicRepository: TopicRepository = new TopicRepository()) {}

  async execute(params: UpdateTopicSchema, session: Session): Promise<Topic> {
    if (!isAdminOrAbove(session.user.role)) {
      throw new Error('Você precisa ser um administrador para atualizar um tópico.');
    }

    const validatedParams = updateTopicUseCaseSchema.safeParse(params);

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

    const topic = await this.topicRepository.updateTopic(updatedTopic);

    log.info('Tópico atualizado', topic);

    return topic;
  }
}
