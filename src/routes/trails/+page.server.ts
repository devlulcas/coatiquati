import { PostgresTrailRepository } from '$modules/trail/repositories/postgres-trail.repository';
import { GetTrails } from '$modules/trail/use-cases/get-trails';
import type { ServerLoad } from '@sveltejs/kit';

export const load: ServerLoad = async () => {
	const trailRepository = new PostgresTrailRepository();

	const getTrails = new GetTrails(trailRepository);

	const trailsResult = await getTrails.execute();

	return {
		trails: trailsResult.error ? [] : trailsResult.data,
		error: trailsResult.error?.message ?? null
	};
};
