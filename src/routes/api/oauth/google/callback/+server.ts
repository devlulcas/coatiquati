import { GOOGLE_OAUTH_STATE_COOKIE_NAME } from '$lib/server/auth';
import { LuciaAuthService } from '$src/modules/user/services/lucia-auth.service';
import { validateSignInWithOAuthProvider } from '$src/modules/user/validations/sign-in-with-oauth-provider.validation';
import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ locals, url, cookies }) => {
	const dataResult = validateSignInWithOAuthProvider({
		code: url.searchParams.get('code'),
		state: url.searchParams.get('state'),
		storedState: cookies.get(GOOGLE_OAUTH_STATE_COOKIE_NAME)
	});

	if (dataResult.error) throw new Response(null, { status: 401 });

	const authService = new LuciaAuthService();

	const session = await authService.signInWithGoogle(dataResult.data.code);

	if (session.error) throw new Response(null, { status: 401 });

	locals.auth.setSession(session.data);

	throw redirect(302, '/');
};
