import { log } from '$lib/server/log';
import { redirectToSignIn } from '$lib/utils/redirect-url';
import { ROLES } from '$modules/user/constants/user-roles';
import type { AuthBarrier } from './protect';

export const adminBarrier: AuthBarrier = (session, event) => {
	const isAdmin = session.user?.roles.includes(ROLES.admin) ?? false;

	return {
		result: isAdmin,
		onFail: () => {
			throw redirectToSignIn(event?.url?.pathname ?? '/', 'NOT_AUTHORIZED');
		},
		onPass: () => {
			log.info(session, 'User is an admin');
		}
	};
};
