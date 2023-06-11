import { LuciaAuthService } from '$src/modules/user/services/lucia-auth.service';
import { SignInWithUsername } from '$src/modules/user/use-cases/sign-in-with-username';
import { validateSignInWithUsername } from '$src/modules/user/validations/sign-in-with-username.validation';
import { fail, redirect, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { PrismaUserRepository } from '$src/modules/user/repositories/prisma-user.repository';
import { emailClient } from '$lib/server/mail';
import { log } from '$lib/server/log';
import { getRedirectReasonFromURL } from '$lib/utils/redirect-url';

export const load: PageServerLoad = async ({ locals, url }) => {
	const session = await locals.auth.validate();

	const redirectData = getRedirectReasonFromURL(url);

	if (session) {
		throw redirect(302, redirectData?.redirectTo ?? '/');
	}

	return {
		redirectData
	};
};

export const actions: Actions = {
	default: async ({ request, locals }) => {
		const form = await request.formData();

		const dataResult = validateSignInWithUsername({
			username: form.get('username'),
			password: form.get('password')
		});

		if (dataResult.error) {
			return fail(400, {
				message: dataResult.error.message
			});
		}

		const signInWithUsername = new SignInWithUsername(
			new LuciaAuthService(),
			new PrismaUserRepository(),
			emailClient
		);

		const sessionResult = await signInWithUsername.execute(dataResult.data);

		if (sessionResult.error) {
			log.error({ error: sessionResult.error }, 'Error signing in with username');

			return fail(400, {
				message: sessionResult.error.message
			});
		}

		log.info({ user: sessionResult.data.userId }, 'User signed in with username');

		locals.auth.setSession(sessionResult.data);
	}
};
