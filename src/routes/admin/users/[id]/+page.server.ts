import { PrismaUserRepository } from '$src/modules/user/repositories/prisma-user.repository';
import { GetUserProfile } from '$src/modules/user/use-cases/get-user-profile';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { Roles, userRolesHasRole } from '$src/modules/user/constants/user-roles';

export const load: PageServerLoad = async ({ locals, params }) => {
	const session = await locals.auth.validateUser();

	if (!session.user) {
		throw error(401, 'Unauthorized');
	}

	const getUserProfile = new GetUserProfile(new PrismaUserRepository());

	const currentUser = await getUserProfile.execute(session.user.id);

	if (currentUser.error) {
		throw error(401, 'Unauthorized');
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
