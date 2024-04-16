'use server';

import { fail, ok, type Result } from '@/shared/lib/result';
import { TrailRepository } from '../repositories/trail-repository';
import type { TrailWithTopicArray } from '../types/trail';

export async function getTrailByIdQuery(id: number): Promise<Result<TrailWithTopicArray>> {
  const trailRepository = new TrailRepository();

  try {
    const trail = await trailRepository.getTrailById(id);
    return ok(trail);
  } catch (error) {
    return fail('Falha ao buscar trilha.');
  }
}
