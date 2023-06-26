import type { TrailPreview } from '$modules/trail/dtos/trail-preview.dto';
import { validateCreateNewTrail } from '$modules/trail/validations/create-new-trail.validation';
import { fail, type ServerLoad } from '@sveltejs/kit';
import type { Actions } from './$types';

const trails = Array<TrailPreview>(10).fill({
	id: '1',
	title: 'Programação funcional com JavaScript',
	slug: '/trails/trilha-mock-1',
	updatedAt: '2021-08-01T00:00:00.000Z',
	description:
		'Aprenda a programar com JavaScript de forma funcional, utilizando programação assíncrona e muito mais.',
	contributors: Array(3).fill({
		id: 1,
		username: 'random',
		avatar: 'https://picsum.photos/50/50'
	}),
	image: {
		url: 'https://picsum.photos/300/300',
		alt: 'Imagem da trilha 1',
		width: 300,
		height: 300
	}
});

export const load: ServerLoad = async () => {
	return {
		trails
	};
};

export const actions: Actions = {
	createTrail: async ({ request }) => {
		const validationResult = await validateCreateNewTrail(request);

		if (validationResult.error) {
			return fail(400, { message: validationResult.error.message });
		}

		return {};
	}
};
