import type { Contributor } from '$modules/user/types/user';
import type { TrailTable } from '../schemas/trail';

export type Trail = Omit<TrailTable, 'searchVector' | 'contributors'> & {
	contributors: Contributor[];
};

export type TrailId = TrailTable['id'];
