import { PostgresTrailRepository } from '$modules/trail/repositories/postgres-trail.repository';
import { GetTrail } from '$modules/trail/use-cases/get-trail';
import { error, type ServerLoad } from '@sveltejs/kit';

export const load: ServerLoad = async ({ params }) => {
	const trailId = typeof params.trail === 'string' ? params.trail : null;

	if (!trailId) {
		throw error(404, 'Trilha não encontrada!');
	}

	const trailRepository = new PostgresTrailRepository();

	const getTrail = new GetTrail(trailRepository);

	const trailResult = await getTrail.execute(trailId);

	if (trailResult.error) {
		throw error(404, trailResult.error.message);
	}

	return {
		trail: trailResult.data,
		error: null
	};
};
