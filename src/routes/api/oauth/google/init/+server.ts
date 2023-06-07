import { GOOGLE_OAUTH_STATE_COOKIE_NAME, googleAuth } from '$lib/server/auth';
import { log } from '$lib/server/log';

import type { RequestHandler } from './$types';

export const GET: RequestHandler = async (request) => {
	const [url, state] = await googleAuth.getAuthorizationUrl();

	request.cookies.set(GOOGLE_OAUTH_STATE_COOKIE_NAME, state, {
		path: '/',
		maxAge: 60 * 60 * 24 * 7 // 1 week
	});

	log.info({ url }, 'Redirecting to Google OAuth');

	return new Response(null, {
		status: 302,
		headers: {
			location: url.toString()
		}
	});
};
