import { createPaginationSchemaWithSearch } from '@/modules/database/types/pagination';
import { z } from 'zod';
import { DrizzleTrailRepository } from '../repositories/trail-repository';
import type { Trail } from '../types/trail';

const getTrailsUseCaseSchema = createPaginationSchemaWithSearch(30);

type GetTrailsUseCaseSchema = Partial<z.infer<typeof getTrailsUseCaseSchema>>;

export async function getTrailsUseCase(params: GetTrailsUseCaseSchema = {}): Promise<Trail[]> {
  const validatedParams = getTrailsUseCaseSchema.safeParse(params);
  
  if (!validatedParams.success) {
    throw new Error('Parâmetros inválidos');
  }

  const repository = new DrizzleTrailRepository();

  return repository.getTrails(validatedParams.data);
}
