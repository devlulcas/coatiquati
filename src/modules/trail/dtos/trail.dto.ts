import type { Trail } from "../entities/trail.entity";

export type CreatableTrailWithoutSlugDTO = Omit<CreatableTrail, 'slug'>;

export type TrailPreview = Omit<Trail, 'crumbs'>;

export type CreatableTrail = Omit<Trail, 'id' | 'crumbs' | 'crumbCount'>;

export type UpdatableTrail = Partial<Omit<Trail, 'crumbs' | 'crumbCount'>>;
