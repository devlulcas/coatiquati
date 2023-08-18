import { db } from '@/modules/database/db';
import { trailTable } from '@/modules/database/schema/trail';
import { eq } from 'drizzle-orm';
import {
  updateTrailUseCaseSchema,
  type UpdateTrailSchema,
} from '../schemas/edit-trail-schema';
import { type Trail } from '../types/trail';

export async function updateTrailUseCase(
  params: UpdateTrailSchema
): Promise<Trail> {
  const validatedParams = updateTrailUseCaseSchema.safeParse(params);

  if (!validatedParams.success) {
    throw new Error('Parâmetros inválidos');
  }

  const newTrail: Partial<Trail> = {
    ...validatedParams.data.trail,
    updatedAt: new Date().toISOString(),
  };

  try {
    return db
      .update(trailTable)
      .set(newTrail)
      .where(eq(trailTable.id, validatedParams.data.trailId))
      .returning()
      .get();
  } catch (error) {
    console.error(error);
    throw new Error('Erro ao atualizar trilha');
  }
}
