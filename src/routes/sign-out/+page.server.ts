import { LuciaAuthService } from '$src/modules/user/services/lucia-auth.service';
import { SignOut } from '$src/modules/user/use-cases/sign-out';
import { redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import { log } from '$lib/server/log';

export const actions: Actions = {
	default: async ({ locals }) => {
		const session = await locals.auth.validate();

		if (!session) {
			throw redirect(302, '/');
		}

		const signOut = new SignOut(new LuciaAuthService());

		await signOut.execute(session.sessionId);

		locals.auth.setSession(null);

		log.info({ user: session.userId, session: session.sessionId }, 'User signed out');

		throw redirect(302, '/');
	}
};
