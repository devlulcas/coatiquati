import type { Session } from '@/modules/auth/types/session';
import { isAdminOrAbove } from '@/modules/auth/utils/is';
import { ContentRepository } from '@/modules/content/repositories/content-repository';
import { TopicRepository } from '../repositories/topic-repository';
import { newTopicSchema, type NewTopicSchema } from '../schemas/new-topic-schema';
import { type NewTopic, type Topic } from '../types/topic';

export async function createNewTopicUseCase(params: NewTopicSchema, session: Session): Promise<Topic> {
  if (!isAdminOrAbove(session.user.role)) {
    throw new Error('Você precisa ser um administrador para criar um novo tópico.');
  }

  const validatedParams = newTopicSchema.safeParse(params);

  if (!validatedParams.success) {
    throw new Error('Parâmetros inválidos');
  }

  const repository = new TopicRepository(new ContentRepository());

  const newTopic: NewTopic = {
    authorId: session.user.id,
    trailId: validatedParams.data.trailId,
    title: validatedParams.data.title,
    description: validatedParams.data.description,
  };

  return repository.createTopic(newTopic);
}
