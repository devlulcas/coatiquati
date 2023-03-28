import type { CrumbPreview } from './crumbs.repository';

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

export interface TrailRepositoryInterface {
	get: (id: string) => Promise<Trail>;
	getAll: () => Promise<TrailPreview[]>;
	create: (trail: CreatableTrail) => Promise<Trail>;
	update: (trail: UpdatableTrail) => Promise<Trail>;
	delete: (id: string) => Promise<void>;
}

export class MockTrailRepository implements TrailRepositoryInterface {
	private trails: Trail[] = [];

	async get(id: string): Promise<Trail> {
		const trail = this.trails.find((trail) => trail.id === id);
		if (!trail) {
			throw new Error('Trail not found');
		}
		return trail;
	}

	async getAll(): Promise<TrailPreview[]> {
		return this.trails.map((trail) => {
			return {
				id: trail.id,
				title: trail.title,
				description: trail.description,
				picture: trail.picture,
				author: trail.author,
				crumbCount: trail.crumbCount
			};
		});
	}

	async create(trail: CreatableTrail): Promise<Trail> {
		const newTrail = {
			id: Math.random().toString(36),
			...trail,
			crumbs: [],
			crumbCount: 0
		};

		this.trails.push(newTrail);

		return newTrail;
	}

	async update(trail: UpdatableTrail): Promise<Trail> {
    if (!trail.id) {
      throw new Error('No id provided');
    }

		const trailToUpdate = await this.get(trail.id);

		const updatedTrail = {
			...trailToUpdate,
			...trail
		};

		this.trails = this.trails.map((trail) => {
			if (trail.id === updatedTrail.id) {
				return updatedTrail;
			}
			return trail;
		});

		return updatedTrail;
	}

	async delete(id: string): Promise<void> {
		this.trails = this.trails.filter((trail) => trail.id !== id);
	}
}
