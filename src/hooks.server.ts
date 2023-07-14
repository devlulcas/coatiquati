import { auth } from '$lib/server/auth';
import { redirectToSignIn } from '$lib/utils/redirect-url';
import { isAdministrator } from '$modules/user/constants/user-roles';
import type { Handle } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';

/**
 * Cria um objeto `auth` no `event.locals` para ser usado em outros hooks.
 */
const authSetupHandle: Handle = async ({ event, resolve }) => {
	event.locals.auth = auth.handleRequest(event);
	return resolve(event);
};

/**
 * Garante que o usuário esteja autenticado como administrador para acessar as rotas de administração.
 */
const authAdminHandle: Handle = async ({ event, resolve }) => {
	if (event.url.pathname.startsWith('/admin')) {
		const session = await event.locals.auth.validateUser();
		const isAdmin = isAdministrator(session.user?.roles);

		if (!isAdmin) {
			throw redirectToSignIn(event.url.pathname);
		}
	}

	return resolve(event);
};

export const handle: Handle = sequence(authSetupHandle, authAdminHandle);
