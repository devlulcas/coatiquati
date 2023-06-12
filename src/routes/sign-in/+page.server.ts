import { log } from '$lib/server/log';
import { compactZodValidationErrors } from '$lib/utils/compact-zod-error';
import { getRedirectReasonFromURL } from '$lib/utils/redirect-url';
import { signInWithUsernameSchema } from '$src/modules/user/dtos/sign-in-with-username.dto';
import { PrismaUserRepository } from '$src/modules/user/repositories/prisma-user.repository';
import { LuciaAuthService } from '$src/modules/user/services/lucia-auth.service';
import { SignInWithUsername } from '$src/modules/user/use-cases/sign-in-with-username';
import { fail, redirect, type Actions } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms/server';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, url }) => {
	const session = await locals.auth.validate();

	const redirectData = getRedirectReasonFromURL(url);

	if (session) {
		throw redirect(302, redirectData?.redirectTo ?? '/');
	}

	const form = await superValidate(signInWithUsernameSchema);

	return {
		form,
		redirectData
	};
};

export const actions: Actions = {
	default: async ({ request, locals }) => {
		const form = await superValidate(request, signInWithUsernameSchema);

		if (!form.valid) {
			form.message = compactZodValidationErrors(form.errors);

			return fail(400, {
				form
			});
		}

		const signInWithUsername = new SignInWithUsername(
			new LuciaAuthService(),
			new PrismaUserRepository()
		);

		const sessionResult = await signInWithUsername.execute(form.data);

		if (sessionResult.error) {
			log.error({ error: sessionResult.error }, 'Error signing in with username');

			form.message = sessionResult.error.message;

			return fail(400, {
				form
			});
		}

		log.info({ user: sessionResult.data.userId }, 'User signed in with username');

		locals.auth.setSession(sessionResult.data);

		return { form };
	}
};
