import { z } from 'zod';
import { TrailRepository } from '../repositories/trail-repository';
import type { TrailWithTopicArray } from '../types/trail';

const getTrailUseCaseSchema = z.object({
  id: z.number({ required_error: 'O id da trilha é obrigatório' }),
});

type GetTrailUseCaseSchema = z.infer<typeof getTrailUseCaseSchema>;

export class GetTrailUseCase {
  constructor(private readonly trailRepository: TrailRepository = new TrailRepository()) {}

  async execute(params: GetTrailUseCaseSchema): Promise<TrailWithTopicArray> {
    const validatedParams = getTrailUseCaseSchema.safeParse(params);

    if (!validatedParams.success) {
      throw new Error('Parâmetros inválidos para buscar trilha.');
    }

    return this.trailRepository.getTrailWithTopicsById(validatedParams.data.id);
  }
}
