import { googleAuth } from '$lib/server/auth';

import type { RequestHandler } from './$types';

export const GET: RequestHandler = async (request) => {
	const [url, state] = await googleAuth.getAuthorizationUrl();

	request.cookies.set('google-oauth-state', state, {
		path: '/',
		maxAge: 60 * 60 * 24 * 7 // 1 week
	});

	return new Response(null, {
		status: 302,
		headers: {
			location: url.toString()
		}
	});
};
