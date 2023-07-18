import { adminBarrier } from '$lib/server/auth/utils/barriers';
import { protect } from '$lib/server/auth/utils/protect';
import { redirectToSignIn } from '$lib/utils/redirect-url';
import { CloudinaryImageService } from '$modules/image/services';
import { newTrailSchema } from '$modules/trail/dtos/new-trail.dto';
import { PostgresTrailRepository } from '$modules/trail/repositories/postgres-trail.repository';
import { CreateTrail } from '$modules/trail/use-cases/create-trail';
import { GetTrails } from '$modules/trail/use-cases/get-trails';
import { fail, type ServerLoad } from '@sveltejs/kit';
import { message, setError, superValidate } from 'sveltekit-superforms/server';
import type { Actions } from './$types';

export const load: ServerLoad = async ({ locals, url }) => {
	await protect({
		locals: locals,
		barriers: [adminBarrier],
		event: { url: url }
	});

	const form = await superValidate(newTrailSchema);

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
	default: async ({ request, locals, url }) => {
		// Valida a sessão do usuário
		const validatedUserSession = await protect({
			locals: locals,
			barriers: [adminBarrier],
			event: { url: url }
		});

		if (validatedUserSession.user === null) {
			throw redirectToSignIn(url.pathname, 'NOT_AUTHENTICATED');
		}

		// Valida o formulário
		const formData = await request.formData();

		const form = await superValidate(formData, newTrailSchema);

		if (!form.valid) {
			return fail(400, {
				form
			});
		}

		// Cria a trilha
		const trailRepository = new PostgresTrailRepository();
		const imageService = new CloudinaryImageService();
		const createTrail = new CreateTrail(trailRepository, imageService);

		const createTrailResult = await createTrail.execute({
			...form.data,
			thumbnail: formData.get('thumbnail'),
			authorId: validatedUserSession.user.id
		});

		if (createTrailResult.error) {
			if (createTrailResult.error.fieldErrors && createTrailResult.error.fieldErrors.thumbnail) {
				setError(form, createTrailResult.error.fieldErrors.thumbnail);
			}

			return  message(form, createTrailResult.error.message);
		}

		// Retorna a trilha criada
		return {
			form
		};
	}
};
