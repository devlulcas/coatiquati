import { db } from '@/modules/database/db';
import { topicTable } from '@/modules/database/schema/topic';
import { eq } from 'drizzle-orm';
import { z } from 'zod';
import { type Topic } from '../types/topic';

const getTopicUseCaseSchema = z.object({
  id: z.number({ required_error: 'O id do tópico é obrigatório' }),
});

type GetTopicUseCaseSchema = z.infer<typeof getTopicUseCaseSchema>;

export async function getTopicUseCase(
  params: GetTopicUseCaseSchema
): Promise<Topic | null> {
  const validatedParams = getTopicUseCaseSchema.safeParse(params);

  if (!validatedParams.success) {
    throw new Error('Parâmetros inválidos');
  }

  try {
    const data = db
      .select()
      .from(topicTable)
      .where(eq(topicTable.id, params.id))
      .limit(1)
      .get();

    if (!data) return null;

    return data;
  } catch (error) {
    console.error(error);
    throw new Error('Erro ao buscar tópico');
  }
}
