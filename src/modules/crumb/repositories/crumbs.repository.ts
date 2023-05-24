import type { CreatableCrumb, CrumbPreview, UpdatableCrumb } from '../dtos/crumbs.dto';
import type { Crumb } from '../entities/crumbs.entity';

export interface CrumbRepositoryInterface {
	findById: (id: string) => Promise<Crumb>;
	findByTrailId: (trailId: string) => Promise<CrumbPreview[]>;
	create: (crumb: CreatableCrumb) => Promise<Crumb>;
	update: (crumb: UpdatableCrumb) => Promise<Crumb>;
	delete: (id: string) => Promise<void>;
}
