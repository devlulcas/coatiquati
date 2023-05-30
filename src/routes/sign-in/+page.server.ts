import { LuciaAuthService } from '$src/modules/user/services/lucia-auth.service';
import { SignInWithUsername } from '$src/modules/user/use-cases/sign-in-with-username';
import { validateSignInWithUsername } from '$src/modules/user/validations/sign-in-with-username.validation';
import { fail, redirect, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { PrismaUserRepository } from '$src/modules/user/repositories/prisma-user.repository';
import { emailClient } from '$lib/server/mail';

export const load: PageServerLoad = async ({ locals }) => {
	const session = await locals.auth.validate();
	if (session) throw redirect(302, '/');
	return {};
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

		const session = await signInWithUsername.execute(dataResult.data);

		if (session.error) {
			return fail(400, {
				message: session.error.message
			});
		}

		locals.auth.setSession(session.data);
	}
};
