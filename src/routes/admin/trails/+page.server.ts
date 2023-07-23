import { newTrailSchema } from '$modules/trail/dtos/new-trail.dto';
import { createTrailAction } from '$modules/trail/handlers/svelte-kit/action-create-trail';
import { PostgresTrailRepository } from '$modules/trail/repositories/postgres-trail.repository';
import { GetTrails } from '$modules/trail/use-cases/get-trails';
import { superValidate } from 'sveltekit-superforms/server';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
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

export type TrailAction = Actions['default'];

export const actions: Actions = {
	default: createTrailAction
};
