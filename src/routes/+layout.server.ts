import { PrismaUserRepository } from '$src/modules/user/repositories/prisma-user.repository';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals }) => {
	const session = await locals.auth.validateUser();

	if (session.user === null) {
		return {
			user: null
		};
	}

	const userRepository = new PrismaUserRepository();

	const user = await userRepository.findById(session.user.id);

	if (user.error) {
		return {
			user: null
		};
	}

	return {
		user: user.data
	};
};
