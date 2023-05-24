import { PrismaUserRepository } from '$src/modules/user/repositories/prisma-user.repository';
import { error, type ServerLoad } from '@sveltejs/kit';

export const load: ServerLoad = async ({ locals }) => {
	const session = await locals.auth.validate();

	if (!session) {
		throw error(401, 'Unauthorized');
	}

	const userRepository = new PrismaUserRepository();

	const userResult = await userRepository.findById(session.userId);

	if (userResult.error) {
		return {
			status: 500,
			error: new Error('Internal Server Error')
		};
	}

	return {
		user: userResult.data
	};
};
