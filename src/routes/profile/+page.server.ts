import { redirectToSignIn } from '$lib/utils/redirect-url';
import { fail } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, url, parent }) => {
	const session = await locals.auth.validate();

	if (!session) {
		throw redirectToSignIn(url.pathname);
	}

	const parentData = await parent();

	if (parentData.user === null) {
		throw fail(404, {
			message: 'Usuário não encontrado'
		});
	}

	return {
		user: parentData.user
	};
};
