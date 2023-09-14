import { db } from '@/modules/database/db';
import {
  trailTable,
  type NewTrailTable,
} from '@/modules/database/schema/trail';
import { z } from 'zod';
import { newTrailSchema } from '../schemas/new-trail-schema';
import { type Trail } from '../types/trail';
import { createTrail } from '../repositories/trail-repository';

const createNewTrailUseCaseSchema = z.object({
  authorId: z.string({ required_error: 'O id do autor é obrigatório' }),
  trail: newTrailSchema,
});

type CreateNewTrailUseCaseSchema = z.infer<typeof createNewTrailUseCaseSchema>;

export async function createNewTrailUseCase(
  params: CreateNewTrailUseCaseSchema
): Promise<Trail> {
  const validatedParams = createNewTrailUseCaseSchema.safeParse(params);

  if (!validatedParams.success) {
    throw new Error('Parâmetros inválidos');
  }

  const newTrail: NewTrailTable = {
    ...validatedParams.data.trail,
    authorId: validatedParams.data.authorId,
  };

  try {
    return createTrail(newTrail);
  } catch (error) {
    console.error(error);
    throw new Error('Erro ao criar trilha');
  }
}
