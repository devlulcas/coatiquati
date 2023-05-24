import type { Pagination } from '$lib/types/pagination';
import type { CreatableTrail, TrailPreview, UpdatableTrail } from '../dtos/trail.dto';
import type { Trail } from '../entities/trail.entity';

export interface TrailRepositoryInterface {
	findById: (id: string) => Promise<Trail>;
	findAll: (pagination: Pagination) => Promise<TrailPreview[]>;
	create: (trail: CreatableTrail) => Promise<Trail>;
	update: (trail: UpdatableTrail) => Promise<Trail>;
	delete: (id: string) => Promise<void>;
}
