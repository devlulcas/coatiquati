import { DrizzleContentRepository } from '@/modules/content/repositories/content-repository';
import { DrizzleTopicRepository } from '../repositories/topic-repository';
import {
  updateTopicUseCaseSchema,
  type UpdateTopicSchema,
} from '../schemas/edit-topic-schema';
import { type Topic } from '../types/topic';

export async function updateTopicUseCase(
  params: UpdateTopicSchema
): Promise<Topic> {
  const validatedParams = updateTopicUseCaseSchema.safeParse(params);

  if (!validatedParams.success) {
    throw new Error('Parâmetros inválidos');
  }

  const repository = new DrizzleTopicRepository(new DrizzleContentRepository());

  try {
    return repository.updateTopic(
      validatedParams.data.topicId,
      validatedParams.data.topic
    );
  } catch (error) {
    console.error(error);
    throw new Error('Erro ao atualizar trilha');
  }
}
