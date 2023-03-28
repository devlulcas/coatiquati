import type { CreatableCrumb, Crumb, CrumbPreview, UpdatableCrumb } from "$src/entities/crumbs.entity";

export interface CrumbRepositoryInterface {
	findById: (id: string) => Promise<Crumb>;
	findByTrailId: (trailId: string) => Promise<CrumbPreview[]>;
	create: (crumb: CreatableCrumb) => Promise<Crumb>;
	update: (crumb: UpdatableCrumb) => Promise<Crumb>;
	delete: (id: string) => Promise<void>;
}

export class MockCrumbRepository implements CrumbRepositoryInterface {
	private crumbs: Crumb[] = [];

	async findById(id: string): Promise<Crumb> {
		const crumb = this.crumbs.find((crumb) => crumb.id === id);
		
    if (!crumb) {
			throw new Error('Crumb not found');
		}

		return crumb;
	}

	async findByTrailId(trailId: string): Promise<CrumbPreview[]> {
		const filteredCrumbs = this.crumbs.filter((crumb) => crumb.trailId === trailId);

		return filteredCrumbs.map((crumb) => ({
      id: crumb.id,
      title: crumb.title,
      description: crumb.description,
      contentTypeAvailable: crumb.contentTypeAvailable,
      trailId: crumb.trailId
    }));
	}

	async create(crumb: CreatableCrumb): Promise<Crumb> {
		const newCrumb = {
			id: Math.random().toString(36),
			...crumb,
			contents: []
		};

		this.crumbs.push(newCrumb);

		return newCrumb;
	}

	async update(crumb: UpdatableCrumb): Promise<Crumb> {
		const index = this.crumbs.findIndex((c) => c.id === crumb.id);

		if (index === -1) {
			throw new Error('Crumb not found');
		}

		const updatedCrumb = {
			...this.crumbs[index],
			...crumb
		};

		this.crumbs[index] = updatedCrumb;

		return updatedCrumb;
	}

	async delete(id: string): Promise<void> {
		const index = this.crumbs.findIndex((c) => c.id === id);
		
    if (index === -1) {
			throw new Error('Crumb not found');
		}

		this.crumbs.splice(index, 1);
	}
}
