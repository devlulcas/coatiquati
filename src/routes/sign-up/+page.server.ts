import { log } from '$lib/server/log';
import { emailClient } from '$lib/server/email';
import { compactZodValidationErrors } from '$lib/utils/compact-zod-error';
import { signUpWithUsernameSchema } from '$src/modules/user/dtos/sign-up-with-username.dto';
import { PostgresUserRepository } from '$src/modules/user/repositories/postgres-user.repository';
import { LuciaAuthService } from '$src/modules/user/services/lucia-auth.service';
import { SignUpWithUsername } from '$src/modules/user/use-cases/sign-up-with-username';
import { fail, redirect, type Actions } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms/server';
import type { PageServerLoad } from './$types';
import { validateSignUpWithUsername } from '$src/modules/user/validations/sign-up-with-username.validation';

export const load: PageServerLoad = async ({ locals }) => {
	const session = await locals.auth.validate();
	if (session) throw redirect(302, '/');
	return {};
};

export const actions: Actions = {
	default: async ({ request, locals }) => {
		const form = await superValidate(request, signUpWithUsernameSchema);

		if (!form.valid) {
			form.message = compactZodValidationErrors(form.errors);

			return fail(400, {
				form
			});
		}

		const dataResult = validateSignUpWithUsername(form.data);

		if (dataResult.error) {
			form.message = dataResult.error.message;

			return fail(400, {
				form
			});
		}

		const signUpWithUsername = new SignUpWithUsername(
			new PostgresUserRepository(),
			new LuciaAuthService(),
			emailClient
		);

		const sessionResult = await signUpWithUsername.execute(dataResult.data);

		if (sessionResult.error) {
			log.error({ error: sessionResult.error }, 'Error signing in with username');

			form.message = sessionResult.error.message;

			return fail(400, {
				form
			});
		}

		locals.auth.setSession(sessionResult.data);

		log.info({ user: sessionResult.data.userId }, 'User signed in with username');

		throw redirect(302, '/');
	}
};
