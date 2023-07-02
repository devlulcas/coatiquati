import type { TrailId } from '../schemas/trail';
import type { CreateTrailDTO } from './create-trail.dto';

export type UpdateTrailDTO = Partial<CreateTrailDTO> & {
	id: TrailId;
};
