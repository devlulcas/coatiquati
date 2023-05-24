import type { Crumb } from "../entities/crumbs.entity";

export type CrumbPreview = Omit<Crumb, 'contents'>;

export type CreatableCrumb = Omit<Crumb, 'id' | 'contents' | 'contentTypeAvailable'>;

export type UpdatableCrumb = Partial<Omit<Crumb, 'contents'>>;
