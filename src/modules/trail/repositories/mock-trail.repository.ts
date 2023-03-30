import type { Pagination } from '$src/shared/types/pagination';
import type { CreatableTrail, Trail, TrailPreview, UpdatableTrail } from '../entities/trail.entity';
import { TrailMapper } from '../mappers/trail.mapper';
import type { TrailRepositoryInterface } from './trail.repository';

export class MockTrailRepository implements TrailRepositoryInterface {
	private trails: Trail[] = [];

	async findById(id: string): Promise<Trail> {
		const trail = this.trails.find((trail) => trail.id === id);

		if (!trail) {
			throw new Error('Trail not found');
		}

		return trail;
	}

	async findAll(pagination: Pagination): Promise<TrailPreview[]> {
    const trails = this.trails.slice(pagination.offset, pagination.offset + pagination.limit);
    return TrailMapper.toDTOList(trails);
	}

	async create(trail: CreatableTrail): Promise<Trail> {
		const newTrail = {
			id: Math.random().toString(36),
			...trail,
			crumbs: [],
			crumbCount: 0
		};

		this.trails.push(newTrail);

		return newTrail;
	}

	async update(trail: UpdatableTrail): Promise<Trail> {
		if (!trail.id) {
			throw new Error('No id provided');
		}

		const trailToUpdate = await this.findById(trail.id);

		const updatedTrail = {
			...trailToUpdate,
			...trail
		};

		this.trails = this.trails.map((trail) => {
			if (trail.id === updatedTrail.id) {
				return updatedTrail;
			}

			return trail;
		});

		return updatedTrail;
	}

	async delete(id: string): Promise<void> {
		this.trails = this.trails.filter((trail) => trail.id !== id);
	}
}
