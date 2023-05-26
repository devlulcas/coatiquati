import { Roles, userRolesHasRole } from '$src/modules/user/constants/user-roles';
import { PrismaUserRepository } from '$src/modules/user/repositories/prisma-user.repository';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const session = await locals.auth.validateUser();

	if (session.user === null) {
		throw redirect(302, '/login');
	}

	const userRepository = new PrismaUserRepository();

	const user = await userRepository.findById(session.user.id);

	if (user.error) {
		throw redirect(302, '/login');
	}

	if (!userRolesHasRole(user.data.roles, Roles.ADMIN)) {
		throw redirect(302, '/login');
	}

	return {
		user: user.data
	};
};
