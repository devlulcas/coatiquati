import { createPaginationSchemaWithSearch } from '@/modules/database/types/pagination';
import { z } from 'zod';
import { TrailRepository } from '../repositories/trail-repository';
import type { Trail } from '../types/trail';

const getTrailsUseCaseSchema = createPaginationSchemaWithSearch(30);

type GetTrailsUseCaseSchema = Partial<z.infer<typeof getTrailsUseCaseSchema>>;

export class GetTrailsUseCase {
  constructor(private readonly trailRepository: TrailRepository = new TrailRepository()) {}

  async execute(params: GetTrailsUseCaseSchema = {}): Promise<Trail[]> {
    const validatedParams = getTrailsUseCaseSchema.safeParse(params);

    if (!validatedParams.success) {
      throw new Error('Parâmetros inválidos para buscar trilhas.');
    }

    return this.trailRepository.getTrails(validatedParams.data);
  }
}
