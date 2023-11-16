import { ContentRepository } from '@/modules/content/repositories/content-repository';
import { z } from 'zod';
import { TopicRepository } from '../repositories/topic-repository';
import type { TopicWithContentArray } from '../types/topic';

const getTopicUseCaseSchema = z.object({
  id: z.number({ required_error: 'O id do tópico é obrigatório' }),
});

type GetTopicUseCaseSchema = z.infer<typeof getTopicUseCaseSchema>;

export async function getTopicUseCase(params: GetTopicUseCaseSchema): Promise<TopicWithContentArray> {
  const validatedParams = getTopicUseCaseSchema.safeParse(params);

  if (!validatedParams.success) {
    throw new Error('Parâmetros inválidos');
  }

  const repository = new TopicRepository(new ContentRepository());

  return repository.getTopicWithContentArray(validatedParams.data.id);
}
