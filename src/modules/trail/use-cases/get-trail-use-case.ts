import { z } from 'zod';
import { TrailRepository } from '../repositories/trail-repository';
import type { TrailWithTopicArray } from '../types/trail';

const getTrailUseCaseSchema = z.object({
  id: z.number({ required_error: 'O id da trilha é obrigatório' }),
});

type GetTrailUseCaseSchema = z.infer<typeof getTrailUseCaseSchema>;

export async function getTrailUseCase(params: GetTrailUseCaseSchema): Promise<TrailWithTopicArray> {
  const validatedParams = getTrailUseCaseSchema.safeParse(params);

  if (!validatedParams.success) {
    throw new Error('Parâmetros inválidos');
  }

  const repository = new TrailRepository();

  return repository.getTrailWithTopicsById(validatedParams.data.id);
}
