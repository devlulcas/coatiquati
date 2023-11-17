import { z } from 'zod';
import { TopicRepository } from '../repositories/topic-repository';
import type { TopicWithContentArray } from '../types/topic';

const getTopicUseCaseSchema = z.object({
  id: z.number({ required_error: 'O id do tópico é obrigatório' }),
});

type GetTopicUseCaseSchema = z.infer<typeof getTopicUseCaseSchema>;

export class GetTopicUseCase {
  constructor(private readonly topicRepository: TopicRepository = new TopicRepository()) {}

  async execute(params: GetTopicUseCaseSchema): Promise<TopicWithContentArray> {
    const validatedParams = getTopicUseCaseSchema.safeParse(params);

    if (!validatedParams.success) {
      throw new Error('Parâmetros inválidos para buscar tópico.');
    }

    return this.topicRepository.getTopicWithContentArray(validatedParams.data.id);
  }
}
