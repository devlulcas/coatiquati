import { db } from '@/modules/database/db';
import { trailTable } from '@/modules/database/schema/trail';
import { like, or } from 'drizzle-orm';
import { z } from 'zod';
import { Trail } from '../types/trail';

const getTrailsUseCaseSchema = z.object({
  limit: z.number().optional().default(10),
  offset: z.number().optional().default(0),
  search: z.string().optional().default(''),
});

type Params = {
  limit?: number;
  offset?: number;
  search?: string;
};

export async function getTrailsUseCase(params: Params): Promise<Trail[]> {
  const validatedParams = getTrailsUseCaseSchema.safeParse(params);

  if (!validatedParams.success) {
    throw new Error('Parâmetros inválidos');
  }

  const { limit, offset, search } = validatedParams.data;

  try {
    const data = db
      .select()
      .from(trailTable)
      .where(
        or(
          like(trailTable.title, `%${search}%`),
          like(trailTable.description, `%${search}%`)
        )
      )
      .limit(limit)
      .offset(offset)
      .all();

    return data;
  } catch (error) {
    throw new Error('Erro ao buscar trilhas');
  }
}
