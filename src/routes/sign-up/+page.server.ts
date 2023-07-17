import { emailClient } from '$lib/server/email';
import { log } from '$lib/server/log';
import { signUpWithUsernameSchema } from '$modules/user/dtos/sign-up-with-username.dto';
import { PostgresUserRepository } from '$modules/user/repositories/postgres-user.repository';
import { LuciaAuthService } from '$modules/user/services/lucia-auth.service';
import { SignUpWithUsername } from '$modules/user/use-cases/sign-up-with-username';
import { fail, redirect, type Actions } from '@sveltejs/kit';
import { setError, superValidate } from 'sveltekit-superforms/server';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const session = await locals.auth.validate();
	if (session) throw redirect(302, '/');
	const form = await superValidate(signUpWithUsernameSchema);
	return { form };
};

export const actions: Actions = {
	default: async ({ request, locals }) => {
		const form = await superValidate(request, signUpWithUsernameSchema);

		if (!form.valid) {
			return setError(form, 'password', form.errors._errors?.join(', ') ?? 'Erro desconhecido');
		}

		const signUpWithUsername = new SignUpWithUsername(
			new PostgresUserRepository(),
			new LuciaAuthService(),
			emailClient
		);

		const sessionResult = await signUpWithUsername.execute(form.data);

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
