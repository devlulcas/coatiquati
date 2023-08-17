import { db } from '@/modules/database/db';
import { trailTable } from '@/modules/database/schema/trail';
import { eq } from 'drizzle-orm';
import { z } from 'zod';
import { type Trail } from '../types/trail';

const getTrailUseCaseSchema = z.object({
  id: z.number({ required_error: 'O id da trilha é obrigatório' }),
});

type Params = z.infer<typeof getTrailUseCaseSchema>;

export async function getTrailUseCase(params: Params): Promise<Trail | null> {
  const validatedParams = getTrailUseCaseSchema.safeParse(params);

  if (!validatedParams.success) {
    throw new Error('Parâmetros inválidos');
  }

  try {
    const data = db
      .select()
      .from(trailTable)
      .where(eq(trailTable.id, params.id))
      .limit(1)
      .get();

    if (!data) return null;

    return data;
  } catch (error) {
    throw new Error('Erro ao buscar trilha');
  }
}
