import { GetTrailBySlugService } from '$src/use-cases/get-trail-by-slug/service';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (ctx) => {
	console.log('ctx breadcrumbs server ts', ctx);

	const getTrailBySlugService = new GetTrailBySlugService();

	const data = await getTrailBySlugService.execute(ctx.params.slug);

	return data;
};
