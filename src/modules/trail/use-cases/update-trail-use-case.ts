import { db } from '@/modules/database/db';
import { trailTable } from '@/modules/database/schema/trail';
import { z } from 'zod';
import { newTrailSchema } from '../schemas/new-trail-schema';
import { Trail } from '../types/trail';

const updateTrailSchema = z.object({
  trail: newTrailSchema,
});

type UpdateTrailParams = z.infer<typeof updateTrailSchema>;

export async function updateTrail(params: UpdateTrailParams): Promise<Trail> {
  const validatedParams = updateTrailSchema.safeParse(params);

  if (!validatedParams.success) {
    throw new Error('Parâmetros inválidos');
  }

  const newTrail = {
    ...validatedParams.data.trail,
  };

  try {
    return db.update(trailTable).set(newTrail).returning().get();
  } catch (error) {
    throw new Error('Erro ao atualizar trilha');
  }
}
