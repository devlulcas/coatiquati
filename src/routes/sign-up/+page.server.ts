import { PrismaUserRepository } from '$src/modules/user/repositories/prisma-user.repository';
import { LuciaAuthService } from '$src/modules/user/services/lucia-auth.service';
import { SignUpWithUsername } from '$src/modules/user/use-cases/sign-up-with-username';
import { validateSignUpWithUsername } from '$src/modules/user/validations/sign-up-with-username.validation';
import { fail, redirect, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { log } from '$lib/server/log';

export const load: PageServerLoad = async ({ locals }) => {
	const session = await locals.auth.validate();
	if (session) throw redirect(302, '/');
	return {};
};

export const actions: Actions = {
	default: async ({ request, locals }) => {
		const form = await request.formData();

		const dataResult = validateSignUpWithUsername({
			username: form.get('username'),
			password: form.get('password'),
			email: form.get('email'),
			name: form.get('name')
		});

		if (dataResult.error) {
			throw fail(400, {
				message: dataResult.error.message
			});
		}

		const signUpWithUsername = new SignUpWithUsername(
			new PrismaUserRepository(),
			new LuciaAuthService()
		);

		const sessionResult = await signUpWithUsername.execute(dataResult.data);

		if (sessionResult.error) {
			log.error({ error: sessionResult.error }, 'Error signing up with username');

			return fail(400, {
				message: sessionResult.error.message
			});
		}

		locals.auth.setSession(sessionResult.data);

		log.info({ user: sessionResult.data.userId }, 'User signed in with username');

		throw redirect(302, '/');
	}
};
