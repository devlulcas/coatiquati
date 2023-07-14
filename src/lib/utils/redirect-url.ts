import { Redirect, redirect } from '@sveltejs/kit';

const reasons = {
	NOT_AUTHENTICATED: (route: string) => `Você precisa estar autenticado para acessar "${route}".`,
	NOT_AUTHORIZED: (route: string) =>
		`Você não tem permissão para acessar "${route}". Entre em contato com o administrador do sistema.`
};

type AuthRedirectReason = keyof typeof reasons;

export function redirectToSignIn(redirectTo: string, reason: AuthRedirectReason = 'NOT_AUTHORIZED'): Redirect {
	return redirect(302, `/sign-in?redirect=${encodeURIComponent(redirectTo)}&reason=${encodeURIComponent(reason)}`);
}

type AuthRedirectData = {
	redirectTo: string;
	reason: AuthRedirectReason;
	reasonMessage: string;
};

export function getRedirectReasonFromURL(url: URL): AuthRedirectData | undefined {
	const reason = url.searchParams.get('reason');
	const route = url.searchParams.get('redirect');

	const isAuthRedirectReason = (reason: unknown): reason is AuthRedirectReason => {
		if (typeof reason !== 'string') return false;
		return Object.keys(reasons).includes(reason);
	};

	if (route) {
		if (isAuthRedirectReason(reason)) {
			return {
				redirectTo: route,
				reason,
				reasonMessage: reasons[reason](route)
			};
		}

		return {
			redirectTo: route,
			reason: 'NOT_AUTHENTICATED',
			reasonMessage: reasons.NOT_AUTHENTICATED(route)
		};
	}
}
