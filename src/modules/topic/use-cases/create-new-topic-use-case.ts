import type { Session } from '@/modules/auth/types/session';
import { isAdminOrAbove } from '@/modules/auth/utils/is';
import { log } from '@/modules/logging/lib/pino';
import { TopicRepository } from '../repositories/topic-repository';
import { newTopicSchema, type NewTopicSchema } from '../schemas/new-topic-schema';
import { type NewTopic, type Topic } from '../types/topic';

export class CreateNewTopicUseCase {
  constructor(private readonly topicRepository: TopicRepository = new TopicRepository()) {}

  async execute(params: NewTopicSchema, session: Session): Promise<Topic> {
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

    const topic = await this.topicRepository.createTopic(newTopic);

    log.info('Novo tópico criado', topic);

    return topic;
  }
}
