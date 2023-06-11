import { redirectToSignIn } from '$lib/utils/redirect-url';
import { PrismaUserRepository } from '$src/modules/user/repositories/prisma-user.repository';
import { GetUserProfile } from '$src/modules/user/use-cases/get-user-profile';
import { fail, type ServerLoad } from '@sveltejs/kit';

export const load: ServerLoad = async ({ locals, url }) => {
	const session = await locals.auth.validate();

	if (!session) {
		throw redirectToSignIn(url.pathname);
	}

	const getUserProfile = new GetUserProfile(new PrismaUserRepository());

	const userResult = await getUserProfile.execute(session.userId);

	if (userResult.error) {
		throw fail(404, {
			message: userResult.error.message
		});
	}

	return {
		user: userResult.data
	};
};
