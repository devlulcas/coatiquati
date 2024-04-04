'use server';

import { TrailRepository } from '../repositories/trail-repository';
import type { Trail } from '../types/trail';

export async function getRecentTrailsQuery(): Promise<Trail[]> {
  const trailRepository = new TrailRepository();
  return trailRepository.getRecentTrails();
}
