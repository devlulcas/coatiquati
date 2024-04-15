'use server';

import { log } from '@/modules/logging/lib/pino';
import { fail, ok, type Result } from '@/shared/lib/result';
import { TrailRepository } from '../repositories/trail-repository';
import type { Trail } from '../types/trail';

export async function getRecentTrailsQuery(): Promise<Result<Trail[]>> {
  const trailRepository = new TrailRepository();

  try {
    const trails = await trailRepository.getRecentTrails();
    return ok(trails);
  } catch (error) {
    log.error('Falha ao buscar trilhas recentes.', String(error));
    return fail('Falha ao buscar trilhas recentes.');
  }
}
