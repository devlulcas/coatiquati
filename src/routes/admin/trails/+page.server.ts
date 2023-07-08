import { adminBarrier } from '$lib/server/auth/utils/barriers';
import { protect } from '$lib/server/auth/utils/protect';
import { formDataToObject } from '$lib/utils/convert-form-data';
import { redirectToSignIn } from '$lib/utils/redirect-url';
import { CloudinaryImageService } from '$modules/image/services';
import { createTrailSchema } from '$modules/trail/dtos/create-trail.dto';
import { PostgresTrailRepository } from '$modules/trail/repositories/postgres-trail.repository';
import { CreateTrail } from '$modules/trail/use-cases/create-trail';
import { GetTrails } from '$modules/trail/use-cases/get-trails';
import { fail, type ServerLoad } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms/server';
import type { Actions } from './$types';

export const load: ServerLoad = async ({ locals, url }) => {
	await protect({
		locals: locals,
		barriers: [adminBarrier],
		event: { url: url }
	});

	const form = await superValidate(createTrailSchema.omit({ thumbnail: true }));

	const trailRepository = new PostgresTrailRepository();

	const getTrails = new GetTrails(trailRepository);

	const trailsResult = await getTrails.execute();

	return {
		form,
		trails: trailsResult.error ? [] : trailsResult.data,
		error: trailsResult.error?.message ?? null
	};
};

export const actions: Actions = {
	createTrail: async ({ request, locals, url }) => {
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
		const createTrail = new CreateTrail(trailRepository, imageService);

		const createTrailResult = await createTrail.execute({
			...form.data,
			thumbnail: imageValidation.data.thumbnail,
			authorId: validatedUserSession.user.id
		});

		if (createTrailResult.error) {
			return fail(500, {
				form,
				thumbnailUploadError: null
			});
		}

		// Retorna a trilha criada
		return {
			form,
			thumbnailUploadError: null,
			trail: createTrailResult.data
		};
	}
};
