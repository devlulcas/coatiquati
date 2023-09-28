import { DrizzleTrailRepository } from '../repositories/trail-repository';
import { updateTrailUseCaseSchema, type UpdateTrailSchema } from '../schemas/edit-trail-schema';

export async function updateTrailUseCase(params: UpdateTrailSchema) {
  const validatedParams = updateTrailUseCaseSchema.safeParse(params);

  if (!validatedParams.success) {
    throw new Error('Parâmetros inválidos');
  }

  const repository = new DrizzleTrailRepository();

  try {
    return repository.updateTrail(validatedParams.data.trailId, validatedParams.data.trail);
  } catch (error) {
    console.error(error);
    throw new Error('Erro ao atualizar trilha');
  }
}
