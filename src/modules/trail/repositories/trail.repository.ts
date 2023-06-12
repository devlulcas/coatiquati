import type { Pagination } from '$lib/types/pagination';
import type { ResultType } from '$lib/types/result';
import type { CreateTrailDTO } from '../dtos/create-trail.dto';
import type { TrailPreview } from '../dtos/trail-preview.dto';
import type { UpdatableTrail } from '../dtos/trail.dto';
import type { Trail } from '../entities/trail.entity';

export type FindManyTrailsParams = {
	author?: string;
	title?: string;
	slug?: string;
};

export type NewTrail = CreateTrailDTO & {
	slug: string;
};

export interface TrailRepository {
	findById: (id: string) => Promise<ResultType<Trail>>;
	findMany(
		params: FindManyTrailsParams,
		pagination: Pagination
	): Promise<ResultType<TrailPreview[]>>;
	create: (trail: NewTrail) => Promise<ResultType<TrailPreview>>;
	update: (trail: UpdatableTrail) => Promise<ResultType<Trail>>;
}
