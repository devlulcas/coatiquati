import { redirectToSignIn } from '$lib/utils/redirect-url';
import { Roles, userRolesHasRole } from '$src/modules/user/constants/user-roles';
import { PostgresUserRepository } from '$src/modules/user/repositories/postgres-user.repository';
import { GetUserProfile } from '$src/modules/user/use-cases/get-user-profile';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

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
		currentUserIsAdmin: userRolesHasRole(Roles.ADMIN, currentUser.data.roles)
	};
};
