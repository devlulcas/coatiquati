import { z } from 'zod';
import { createTrailRepository } from '../repositories/trail-repository';
import type { TrailWithTopicArray } from '../types/trail';

const getTrailUseCaseSchema = z.object({
  id: z.number({ required_error: 'O id da trilha é obrigatório' }),
});

type GetTrailUseCaseSchema = z.infer<typeof getTrailUseCaseSchema>;

export async function getTrailUseCase(
  params: GetTrailUseCaseSchema
): Promise<TrailWithTopicArray> {
  const validatedParams = getTrailUseCaseSchema.safeParse(params);

  if (!validatedParams.success) {
    throw new Error('Parâmetros inválidos');
  }

  const repository = createTrailRepository();

  try {
    return repository.getTrailWithTopicsById(validatedParams.data.id);
  } catch (error) {
    console.error(error);
    throw new Error('Erro ao buscar trilha');
  }
}
