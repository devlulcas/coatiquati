import type { CrumbPreview } from "$src/modules/crumb/entities/crumbs.entity";

export type Trail = {
	id: string;
	title: string;
	description: string;
	picture: string;
	author: string;
	crumbs: CrumbPreview[];
	crumbCount: number;
};

export type TrailPreview = Omit<Trail, 'crumbs'>;

export type CreatableTrail = Omit<Trail, 'id' | 'crumbs' | 'crumbCount'>;

export type UpdatableTrail = Partial<Omit<Trail, 'crumbs' | 'crumbCount'>>;
