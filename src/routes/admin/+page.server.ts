import { redirectToSignIn } from '$lib/utils/redirect-url';
import { listUsersSchema } from '$modules/user/dtos/list-users.dto';
import { PostgresUserRepository } from '$modules/user/repositories/postgres-user.repository';
import { ListUsers } from '$modules/user/use-cases/list-users';
import { superValidate } from 'sveltekit-superforms/server';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url, parent }) => {
	const parentData = await parent();

	if (parentData.user === null) throw redirectToSignIn(url.pathname);

	const listUsers = new ListUsers(new PostgresUserRepository());

	const form = await superValidate(url.searchParams, listUsersSchema);

	const users = await listUsers.execute(form.data);

	return {
		form,
		currentUser: parentData.user,
		users: users.data ?? []
	};
};
