import { GetTrailsService } from '$src/use-cases/get-trails/service';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (ctx) => {
	console.log('ctx trails server ts', ctx);

	const getTrailsService = new GetTrailsService();

	const data = await getTrailsService.execute();

	return data;
};
