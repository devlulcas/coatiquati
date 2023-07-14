import { redirectToSignIn } from '$lib/utils/redirect-url';
import { PostgresBanRegistryRepository } from '$modules/ban/repositories/postgres-ban-registry.repository';
import { BanUser } from '$modules/ban/use-cases/ban-user';
import { isAdministrator } from '$modules/user/constants/user-roles';
import { PostgresUserRepository } from '$modules/user/repositories/postgres-user.repository';
import { GetUserProfile } from '$modules/user/use-cases/get-user-profile';
import { error } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, params, url }) => {
	const session = await locals.auth.validateUser();

	if (!session.user) {
		throw redirectToSignIn(url.pathname);
	}

	const getUserProfile = new GetUserProfile(new PostgresUserRepository());

	const currentUser = await getUserProfile.execute(session.user.id);

	if (currentUser.error) {
		throw redirectToSignIn(url.pathname);
	}

	const user = await getUserProfile.execute(params.id);

	if (user.error) {
		throw error(404, 'User not found');
	}

	return {
		user: user.data,
		currentUserIsAdmin: isAdministrator(currentUser.data.roles)
	};
};

export const actions = {
	ban: async ({ params, locals, url, request }) => {
		const session = await locals.auth.validateUser();

		if (!session.user) {
			throw redirectToSignIn(url.pathname);
		}

		const getUserProfile = new GetUserProfile(new PostgresUserRepository());

		const currentUser = await getUserProfile.execute(session.user.id);

		if (currentUser.error) {
			throw redirectToSignIn(url.pathname);
		}

		const user = await getUserProfile.execute(params.id);

		if (user.error) {
			throw error(404, 'User not found');
		}

		// Previne que um usuário comum/banido bana outro usuário comum ou um administrador
		if (!isAdministrator(currentUser.data.roles) || isAdministrator(user.data.roles) || user.data.active === false) {
			throw error(403, 'Forbidden');
		}

		const form = await request.formData();

		const banUser = new BanUser(new PostgresUserRepository(), new PostgresBanRegistryRepository());

		const banResult = await banUser.execute({
			userId: user.data.id,
			adminId: currentUser.data.id,
			reason: form.get('reason')?.toString() || 'Não informado'
		});

		if (banResult.error) {
			throw error(403, banResult.error.message);
		}

		return {
			data: banResult.data
		};
	}
} satisfies Actions;
