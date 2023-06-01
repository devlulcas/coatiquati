import { Roles, userRolesHasRole } from '$src/modules/user/constants/user-roles';
import { listUsersSchema } from '$src/modules/user/dtos/list-users.dto';
import { PrismaUserRepository } from '$src/modules/user/repositories/prisma-user.repository';
import { GetUserProfile } from '$src/modules/user/use-cases/get-user-profile';
import { ListUsers } from '$src/modules/user/use-cases/list-users';
import { redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms/server';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, url }) => {
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

	const form = await superValidate(url.searchParams, listUsersSchema);

	const users = await listUsers.execute(form.data);

	return {
		form,
		currentUser: user.data,
		users: users.data ?? []
	};
};
