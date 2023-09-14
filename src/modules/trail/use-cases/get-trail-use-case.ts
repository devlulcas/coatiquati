import { z } from 'zod';
import { getTrailById } from '../repositories/trail-repository';

const getTrailUseCaseSchema = z.object({
  id: z.number({ required_error: 'O id da trilha é obrigatório' }),
});

type GetTrailUseCaseSchema = z.infer<typeof getTrailUseCaseSchema>;

export async function getTrailUseCase(params: GetTrailUseCaseSchema) {
  const validatedParams = getTrailUseCaseSchema.safeParse(params);

  if (!validatedParams.success) {
    throw new Error('Parâmetros inválidos');
  }

  try {
    return getTrailById(validatedParams.data.id);
  } catch (error) {
    console.error(error);
    throw new Error('Erro ao buscar trilha');
  }
}
