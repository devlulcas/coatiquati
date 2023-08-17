import { db } from '@/modules/database/db';
import { trailTable } from '@/modules/database/schema/trail';
import { z } from 'zod';
import { newTrailSchema } from '../schemas/new-trail-schema';
import { type Trail } from '../types/trail';

const createNewTrailUseCaseSchema = z.object({
  authorId: z.string({ required_error: 'O id do autor é obrigatório' }),
  trail: newTrailSchema,
});

type Params = z.infer<typeof createNewTrailUseCaseSchema>;

export async function createNewTrailUseCase(params: Params): Promise<Trail> {
  const validatedParams = createNewTrailUseCaseSchema.safeParse(params);

  if (!validatedParams.success) {
    throw new Error('Parâmetros inválidos');
  }

  const newTrail = {
    ...validatedParams.data.trail,
    authorId: validatedParams.data.authorId,
  };

  try {
    return db.insert(trailTable).values(newTrail).returning().get();
  } catch (error) {
    throw new Error('Erro ao criar trilha');
  }
}
