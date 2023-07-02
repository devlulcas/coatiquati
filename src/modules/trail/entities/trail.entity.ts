import type { Contributor } from '$modules/user/entities/contributor.entity';
import type { Trail as TrailSchema } from '../schemas/trail';

export type Trail = Omit<TrailSchema, 'searchVector'> & {
	contributors: Contributor[];
};
