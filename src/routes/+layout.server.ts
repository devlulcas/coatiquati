import { PrismaUserRepository } from '$src/modules/user/repositories/prisma-user.repository';
import { GetUserProfile } from '$src/modules/user/use-cases/get-user-profile';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals }) => {
	const session = await locals.auth.validateUser();

	if (session.user === null) {
		return {
			user: null
		};
	}

	const getUserProfile = new GetUserProfile(new PrismaUserRepository());

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
