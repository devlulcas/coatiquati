import type { Trail } from "../entities/trail.entity";
import type { TrailRepositoryInterface } from "../repositories/trail.repository";

export class GetTrail {
  constructor(private trailRepository: TrailRepositoryInterface) {}

  async execute(id: string): Promise<Trail> {
    const trail = await this.trailRepository.findById(id);

    if (!trail) {
      throw new Error('No trail found');
    }

    return trail;
  }
}