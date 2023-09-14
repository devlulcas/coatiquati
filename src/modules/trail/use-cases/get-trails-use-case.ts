import { createPaginationSchema } from '@/modules/database/types/pagination';
import { z } from 'zod';
import { getTrails } from '../repositories/trail-repository';

const getTrailsUseCaseSchema = createPaginationSchema(30, 0).merge(
  z.object({
    search: z.string().optional().default(''),
  })
);

type GetTrailsUseCaseSchema = Partial<z.infer<typeof getTrailsUseCaseSchema>>;

export async function getTrailsUseCase(params: GetTrailsUseCaseSchema) {
  const validatedParams = getTrailsUseCaseSchema.safeParse(params);

  if (!validatedParams.success) {
    throw new Error('Parâmetros inválidos');
  }

  try {
    return getTrails({
      take: validatedParams.data.take,
      skip: validatedParams.data.skip,
      query: validatedParams.data.search,
    });
  } catch (error) {
    console.error(error);
    throw new Error('Erro ao buscar trilhas');
  }
}
