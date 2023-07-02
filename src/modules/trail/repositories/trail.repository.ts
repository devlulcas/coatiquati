import type { ResultType } from '$lib/types/result';
import type { GetTrailsDTO } from '../dtos/get-trails.dto';
import type { TrailPreview } from '../dtos/trail-preview.dto';
import type { NewTrail, Trail, TrailId } from '../schemas/trail';

export type UpdateTrailDPO = Partial<NewTrail> & {
	id: TrailId;
};

export type TrailPreviewDPO = Pick<TrailPreview, 'contributors' | 'description' | 'id' | 'title'> & {
	thumbnail: string;
	thumbnailDescription: string;
	updatedAt: Date;
};

export interface TrailRepository {
	findById(id: TrailId): Promise<ResultType<Trail>>;
	findMany(params: GetTrailsDTO): Promise<ResultType<TrailPreviewDPO[]>>;
	create(data: NewTrail): Promise<ResultType<TrailPreviewDPO>>;
	update(data: UpdateTrailDPO): Promise<ResultType<Trail>>;
}
