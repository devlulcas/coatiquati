import { db } from '@/modules/database/db';
import {
  topicTable,
  type NewTopicTable,
} from '@/modules/database/schema/topic';
import { z } from 'zod';
import { newTopicSchema } from '../schemas/new-topic-schema';
import { type Topic } from '../types/topic';

const createNewTopicUseCaseSchema = z.object({
  authorId: z.string({ required_error: 'O id do autor é obrigatório' }),
  topic: newTopicSchema,
});

type CreateNewTopicUseCaseSchema = z.infer<typeof createNewTopicUseCaseSchema>;

export async function createNewTopicUseCase(
  params: CreateNewTopicUseCaseSchema
): Promise<Topic> {
  const validatedParams = createNewTopicUseCaseSchema.safeParse(params);

  console.log('validatedParams', validatedParams);

  if (!validatedParams.success) {
    console.log('validatedParams', validatedParams.error);
    throw new Error('Parâmetros inválidos');
  }

  const newTopic: NewTopicTable = {
    ...validatedParams.data.topic,
    authorId: validatedParams.data.authorId,
  };

  try {
    return db.insert(topicTable).values(newTopic).returning().get();
  } catch (error) {
    console.error(error);
    throw new Error('Erro ao criar tópico');
  }
}
