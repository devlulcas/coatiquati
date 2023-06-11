import { PrismaUserRepository } from '$src/modules/user/repositories/prisma-user.repository';
import { GetUserProfile } from '$src/modules/user/use-cases/get-user-profile';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { Roles, userRolesHasRole } from '$src/modules/user/constants/user-roles';
import { redirectToSignIn } from '$lib/utils/redirect-url';

export const load: PageServerLoad = async ({ locals, params, url }) => {
	const session = await locals.auth.validateUser();

	if (!session.user) {
		throw redirectToSignIn(url.pathname);
	}

	const getUserProfile = new GetUserProfile(new PrismaUserRepository());

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
