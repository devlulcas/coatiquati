import { LuciaAuthService } from '$src/modules/user/services/lucia-auth.service';
import { SignOut } from '$src/modules/user/use-cases/sign-out';
import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ locals }) => {
	const session = await locals.auth.validate();

	if (!session) {
		throw redirect(302, '/');
	}

	const signOut = new SignOut(new LuciaAuthService());

	await signOut.execute(session.sessionId);

	locals.auth.setSession(null);

	throw redirect(302, '/');
};
