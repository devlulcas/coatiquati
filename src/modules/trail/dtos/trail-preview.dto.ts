import type { Image } from '$lib/components/image';
import type { User } from '../../user/entities/user.entity';

type Contributor = Pick<User, 'id' | 'username' | 'avatar'>;

export type TrailPreview = {
	image: Image;
	contributors: Contributor[];
	title: string;
	description: string;
	slug: string;
	updatedAt: string;
	id: string;
};
