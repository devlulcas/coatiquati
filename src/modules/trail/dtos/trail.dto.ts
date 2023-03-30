import type { CreatableTrail } from '../entities/trail.entity';

export type CreatableTrailWithoutSlugDTO = Omit<CreatableTrail, 'slug'>;
