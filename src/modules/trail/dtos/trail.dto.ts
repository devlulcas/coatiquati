import type { Image } from '$lib/types/image';
import type { Trail } from '../entities/trail.entity';

export type CreatableTrailWithoutSlugDTO = Omit<CreatableTrail, 'slug'>;

type Contributor = {
	username: string;
	image: Image;
};

export type TrailPreview = {
	image: Image;
	contributors: Contributor[];
	title: string;
	description: string;
	slug: string;
	updatedAt: string;
	id: string;
};

export type CreatableTrail = Omit<Trail, 'id' | 'crumbs' | 'crumbCount'>;

export type UpdatableTrail = Partial<Omit<Trail, 'crumbs' | 'crumbCount'>>;
