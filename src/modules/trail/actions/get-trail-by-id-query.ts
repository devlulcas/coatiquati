'use server';

import { TrailRepository } from '../repositories/trail-repository';
import type { TrailWithTopicArray } from '../types/trail';

export async function getTrailByIdQuery(id: number): Promise<TrailWithTopicArray> {
  const trailRepository = new TrailRepository();
  return trailRepository.getTrailById(id);
}
