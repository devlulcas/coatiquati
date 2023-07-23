import { updateTrailSchema } from "$modules/trail/dtos/update-trail.dto";
import { deleteTrailAction } from "$modules/trail/handlers/svelte-kit/action-delete-trail";
import { updateTrailAction } from "$modules/trail/handlers/svelte-kit/action-update-trail";
import { PostgresTrailRepository } from "$modules/trail/repositories/postgres-trail.repository";
import { GetTrail } from "$modules/trail/use-cases/get-trail";
import { error } from '@sveltejs/kit';
import { superValidate } from "sveltekit-superforms/server";
import type { Actions, PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ params }) => {
	const trailRepository = new PostgresTrailRepository();
	const getTrail = new GetTrail(trailRepository);

	const trailResult = await getTrail.execute(params.trail);

	if (trailResult.error) {
		throw error(404, { message: trailResult.error.message });
	}

	const form = await superValidate(trailResult.data, updateTrailSchema);

	return {
		form,
		trail: trailResult.data
	};
};

export type SpecificTrailAction = Actions['default'];

export const actions: Actions = {
	updateTrail: updateTrailAction,
	deleteTrail: deleteTrailAction
};
