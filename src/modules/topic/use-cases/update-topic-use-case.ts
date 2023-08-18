import { db } from '@/modules/database/db';
import { topicTable } from '@/modules/database/schema/topic';
import { eq } from 'drizzle-orm';
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

  const newTopic: Partial<Topic> = {
    ...validatedParams.data.topic,
    updatedAt: new Date().toISOString(),
  };

  try {
    return db
      .update(topicTable)
      .set(newTopic)
      .where(eq(topicTable.id, validatedParams.data.topicId))
      .returning()
      .get();
  } catch (error) {
    console.error(error);
    throw new Error('Erro ao atualizar trilha');
  }
}
