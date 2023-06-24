import { GOOGLE_OAUTH_STATE_COOKIE_NAME } from '$lib/server/auth';
import { LuciaAuthService } from '$modules/user/services/lucia-auth.service';
import { validateSignInWithOAuthProvider } from '$modules/user/validations/sign-in-with-oauth-provider.validation';
import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { log } from '$lib/server/log';

export const GET: RequestHandler = async ({ locals, url, cookies }) => {
	const dataResult = validateSignInWithOAuthProvider({
		code: url.searchParams.get('code'),
		state: url.searchParams.get('state'),
		storedState: cookies.get(GOOGLE_OAUTH_STATE_COOKIE_NAME)
	});

	if (dataResult.error) {
		log.error({ error: dataResult.error }, 'Error validating Google OAuth callback');
		throw new Response(null, { status: 401 });
	}

	const authService = new LuciaAuthService();

	const session = await authService.signInWithGoogle(dataResult.data.code);

	if (session.error) {
		log.error({ error: session.error }, 'Error signing in with Google OAuth');
		throw new Response(null, { status: 401 });
	}

	locals.auth.setSession(session.data);

	throw redirect(302, '/');
};
