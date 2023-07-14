import { adminBarrier } from '$lib/server/auth/utils/barriers';
import { protect } from '$lib/server/auth/utils/protect';
import { formDataToObject } from '$lib/utils/convert-form-data';
import { redirectToSignIn } from '$lib/utils/redirect-url';
import { CloudinaryImageService } from '$modules/image/services';
import { createTrailSchema } from '$modules/trail/dtos/create-trail.dto';
import { PostgresTrailRepository } from '$modules/trail/repositories/postgres-trail.repository';
import { GetTrail } from '$modules/trail/use-cases/get-trail';
import { UpdateTrail } from '$modules/trail/use-cases/update-trail';
import { error, fail, type ServerLoad } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms/server';
import type { Actions } from './$types';

export const load: ServerLoad = async ({ locals, url, params }) => {
	if (params.id === undefined) {
		throw error(404, 'Not found');
	}

	await protect({
		locals: locals,
		barriers: [adminBarrier],
		event: { url: url }
	});

	const trailRepository = new PostgresTrailRepository();

	const getTrail = new GetTrail(trailRepository);

	const trailResult = await getTrail.execute(params.id);

	if (trailResult.error) {
		throw error(404, 'Not found');
	}

	const form = await superValidate(
		{
			title: trailResult.data.title,
			description: trailResult.data.description,
			thumbnailAlt: trailResult.data.thumbnailDescription
		},
		createTrailSchema.omit({ thumbnail: true })
	);

	return {
		form,
		trail: trailResult.error ? [] : trailResult.data,
		thumbnail: trailResult.data.thumbnail,
		error: null
	};
};

export const actions: Actions = {
	createTrail: async ({ request, locals, url, params }) => {
    if (params.id === undefined) {
      throw error(404, 'Not found');
    }
    
		// Valida a sessão do usuário
		const validatedUserSession = await protect({
			locals: locals,
			barriers: [adminBarrier],
			event: { url: url }
		});

		if (validatedUserSession.user === null) {
			throw redirectToSignIn(url.pathname, 'NOT_AUTHENTICATED');
		}

		// Valida o formulário sem a imagem
		const formData = await request.formData();

		const form = await superValidate(formData, createTrailSchema.omit({ thumbnail: true }));

		if (!form.valid) {
			return fail(400, {
				form,
				thumbnailUploadError: null
			});
		}

		// Valida a imagem
		const imageValidation = createTrailSchema.pick({ thumbnail: true }).safeParse(formDataToObject(formData));

		if (!imageValidation.success) {
			return fail(400, {
				form,
				thumbnailUploadError: imageValidation.error.flatten().fieldErrors.thumbnail
			});
		}

		// Cria a trilha
		const trailRepository = new PostgresTrailRepository();
		const imageService = new CloudinaryImageService();
		const updateTrail = new UpdateTrail(trailRepository, imageService);

		const updateTrailResult = await updateTrail.execute({
      ...form.data,
      id: params.id,
			thumbnail: imageValidation.data.thumbnail,
			authorId: validatedUserSession.user.id
		});

		if (updateTrailResult.error) {
			return fail(500, {
				form,
				thumbnailUploadError: null
			});
		}

		// Retorna a trilha criada
		return {
			form,
			thumbnailUploadError: null,
			trail: updateTrailResult.data
		};
	}
};
