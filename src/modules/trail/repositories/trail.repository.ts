import type { ResultType } from '$lib/types/result';
import type { TrailsSearchSchema } from '../dtos/trails-search';
import type { NewTrailTable } from '../schemas/trail';
import type { Trail, TrailId } from '../types/trail';

export type NewTrailPersinstance = NewTrailTable;

export type UpdateTrailPersinstance = Partial<NewTrailTable> & {
	id: TrailId;
};

export interface TrailRepository {
	findById(id: TrailId): Promise<ResultType<Trail>>;
	findMany(params: TrailsSearchSchema): Promise<ResultType<Trail[]>>;
	create(data: NewTrailPersinstance): Promise<ResultType<Trail>>;
	update(data: UpdateTrailPersinstance): Promise<ResultType<Trail>>;
}
