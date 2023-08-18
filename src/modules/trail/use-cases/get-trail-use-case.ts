import { db } from '@/modules/database/db';
import { topicTable } from '@/modules/database/schema/topic';
import { trailTable } from '@/modules/database/schema/trail';
import type { Topic } from '@/modules/topic/types/topic';
import { eq } from 'drizzle-orm';
import { z } from 'zod';
import { type Trail } from '../types/trail';

const getTrailUseCaseSchema = z.object({
  id: z.number({ required_error: 'O id da trilha é obrigatório' }),
});

type GetTrailUseCaseSchema = z.infer<typeof getTrailUseCaseSchema>;

type Result = {
  trail: Trail;
  topics: Topic[];
} | null;

export async function getTrailUseCase(
  params: GetTrailUseCaseSchema
): Promise<Result> {
  const validatedParams = getTrailUseCaseSchema.safeParse(params);

  if (!validatedParams.success) {
    throw new Error('Parâmetros inválidos');
  }

  try {
    const data = db
      .select()
      .from(trailTable)
      .where(eq(trailTable.id, params.id))
      .leftJoin(topicTable, eq(trailTable.id, topicTable.trailId))
      .all();

    const trail = data.at(0)?.trail;

    if (!trail) return null;

    const topics: Topic[] = [];

    for (const item of data) {
      if (!item.topic) continue;

      if (topics.find((topic) => topic.id === item.topic?.id)) {
        continue;
      }

      topics.push(item.topic);
    }

    return { trail, topics };
  } catch (error) {
    console.error(error);
    throw new Error('Erro ao buscar trilha');
  }
}
