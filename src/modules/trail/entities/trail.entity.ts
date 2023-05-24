import type { CrumbPreview } from "$src/modules/crumb/entities/crumbs.entity";

export type Trail = {
	id: string;
	title: string;
	description: string;
	picture: string;
	author: string;
	crumbs: CrumbPreview[];
	crumbCount: number;
  slug: string;
};

