import { formDataToObject } from '$lib/utils/convert-form-data';
import { CloudinaryImageService } from '$modules/image/services';
import { createTrailSchema } from '$modules/trail/dtos/create-trail.dto';
import type { TrailPreview } from '$modules/trail/dtos/trail-preview.dto';
import { fail, type ServerLoad } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms/server';
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
	const form = await superValidate(createTrailSchema.omit({ image: true }));

	return {
		form,
		trails
	};
};

export const actions: Actions = {
	createTrail: async ({ request }) => {
		const formData = await request.formData();

		const form = await superValidate(formData, createTrailSchema.omit({ image: true }));

		if (!form.valid) {
			return fail(400, {
				form,
				imageUploadError: null
			});
		}

		console.log(form.data);

		const imageValidation = createTrailSchema
			.pick({ image: true })
			.safeParse(formDataToObject(formData));

		if (!imageValidation.success) {
			return fail(400, {
				form,
				imageUploadError: imageValidation.error.flatten().fieldErrors.image
			});
		}

		const data = {
			...form.data,
			image: imageValidation.data.image
		};

		const imageService = new CloudinaryImageService();

		const url = await imageService.uploadImage(data.image, {
			width: 600,
			height: 600
		});

		if (url.error) {
			return fail(400, {
				form,
				imageUploadError: [url.error.message]
			});
		}

		return {
			form,
			url: url.data
		};
	}
};
