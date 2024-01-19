import { TrailRepository } from '../repositories/trail-repository';
import type { Trail } from '../types/trail';

export class GetRecentTrailsUseCase {
  constructor(private readonly trailRepository: TrailRepository = new TrailRepository()) {}

  async execute(): Promise<Trail[]> {
    return this.trailRepository.getRecentTrails();
  }
}
