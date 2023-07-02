import type { Image } from '$lib/types/image';
import type { Contributor } from '$modules/user/entities/contributor.entity';

export type TrailPreview = {
	thumbnail: Image;
	contributors: Contributor[];
	title: string;
	description: string;
	slug: string;
	updatedAt: string;
	id: string;
};
