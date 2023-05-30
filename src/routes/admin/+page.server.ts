import { Roles, userRolesHasRole } from '$src/modules/user/constants/user-roles';
import { PrismaUserRepository } from '$src/modules/user/repositories/prisma-user.repository';
import { GetUserProfile } from '$src/modules/user/use-cases/get-user-profile';
import { ListUsers } from '$src/modules/user/use-cases/list-users';
import { validateListUsersDTOSchema } from '$src/modules/user/validations/list-users.validation';
import { type Actions, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const session = await locals.auth.validateUser();

	if (session.user === null) {
		throw redirect(302, '/login');
	}

	const getUserProfile = new GetUserProfile(new PrismaUserRepository());

	const user = await getUserProfile.execute(session.user.id);

	if (user.error) {
		throw redirect(302, '/login');
	}

	if (!userRolesHasRole(Roles.ADMIN, user.data.roles)) {
		throw redirect(302, '/login');
	}

	const listUsers = new ListUsers(new PrismaUserRepository());

	const admins = await listUsers.execute({
		role: Roles.ADMIN
	});

	return {
		admins: admins.data
	};
};

export const actions = {
	listUsers: async ({ locals, url }) => {
		const session = await locals.auth.validateUser();

		if (session.user === null) {
			throw redirect(302, '/login');
		}

		const listUsers = new ListUsers(new PrismaUserRepository());

		const params = validateListUsersDTOSchema({
			pagination: {
				page: url.searchParams.get('page'),
				limit: url.searchParams.get('limit')
			},
			role: url.searchParams.get('role'),
			username: url.searchParams.get('username'),
			email: url.searchParams.get('email')
		});

		if (params.error) {
			return {
				users: [],
				error: params.error.message
			};
		}

		const users = await listUsers.execute(params.data);

		if (users.error) {
			return {
				users: [],
				error: users.error.message
			};
		}

		return {
			users: users.data
		};
	}
} satisfies Actions;
