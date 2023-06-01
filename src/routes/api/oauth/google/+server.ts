import { googleAuth, auth } from '$lib/server/auth';
import { redirect } from '@sveltejs/kit';

import type { RequestHandler } from './$types';
import { Roles } from '$src/modules/user/constants/user-roles';

export const GET: RequestHandler = async (request) => {
	const code = request.url.searchParams.get('code');
	const state = request.url.searchParams.get('state');

	const storedState = request.cookies.get('google-oauth-state');

	if (state !== storedState || !code) throw new Response(null, { status: 401 });

	try {
		const { existingUser, providerUser, createUser } = await googleAuth.validateCallback(code);

		const getUser = async () => {
			if (existingUser) {
				return existingUser;
			}

			// Google doesn't provide an email address, so we'll just fake it
			return createUser({
				username: providerUser.name,
				roles: [Roles.USER],
				email: providerUser.email || providerUser.sub + '@google.com',
				name: providerUser.name
			});
		};

		const user = await getUser();

		const session = await auth.createSession(user.id);

		request.locals.auth.setSession(session);
	} catch (error) {
		console.log(error);
		return new Response(null, {
			status: 500
		});
	}

	throw redirect(302, '/');
};
