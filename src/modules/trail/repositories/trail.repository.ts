import type { Pagination } from '$src/shared/types/pagination';
import type { CreatableTrail, Trail, TrailPreview, UpdatableTrail } from '../entities/trail.entity';

export interface TrailRepositoryInterface {
	findById: (id: string) => Promise<Trail>;
	findAll: (pagination: Pagination) => Promise<TrailPreview[]>;
	create: (trail: CreatableTrail) => Promise<Trail>;
	update: (trail: UpdatableTrail) => Promise<Trail>;
	delete: (id: string) => Promise<void>;
}
