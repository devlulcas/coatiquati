import { PostgresUserRepository } from '$modules/user/repositories/postgres-user.repository';
import { GetUserProfile } from '$modules/user/use-cases/get-user-profile';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals }) => {
	const session = await locals.auth.validateUser();

	if (session.user === null) {
		return {
			user: null
		};
	}

	const getUserProfile = new GetUserProfile(new PostgresUserRepository());

	const userResult = await getUserProfile.execute(session.user.id);

	if (userResult.error) {
		return {
			user: null
		};
	}

	return {
		user: userResult.data
	};
};
