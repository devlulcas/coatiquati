import { redirectToSignIn } from '$lib/utils/redirect-url';
import { listUsersSchema } from '$src/modules/user/dtos/list-users.dto';
import { PrismaUserRepository } from '$src/modules/user/repositories/prisma-user.repository';
import { ListUsers } from '$src/modules/user/use-cases/list-users';
import { superValidate } from 'sveltekit-superforms/server';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url, parent }) => {
	const parentData = await parent();

	if (parentData.user === null) throw redirectToSignIn(url.pathname);

	const listUsers = new ListUsers(new PrismaUserRepository());

	const form = await superValidate(url.searchParams, listUsersSchema);

	const users = await listUsers.execute(form.data);

	return {
		form,
		currentUser: parentData.user,
		users: users.data ?? []
	};
};
