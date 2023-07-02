import type { RequestEvent } from '@sveltejs/kit';

type ValidatedUserSession = ReturnType<App.Locals['auth']['validateUser']> extends Promise<infer U> ? U : never;

export type AuthBarrierResult = {
	result: boolean;
	onFail: () => void;
	onPass: () => void;
};

export type AuthBarrier = (
	session: ValidatedUserSession,
	event?: Partial<RequestEvent>
) => AuthBarrierResult | Promise<AuthBarrierResult>;

type ProtectOptions = {
	locals: App.Locals;
	barriers?: AuthBarrier[];
	defaultOnBarriersFail?: () => void;
	defaultOnBarriersPass?: () => void;
	event?: Partial<RequestEvent>;
};

/**
 * Protege uma rota contra usuários não autenticados e usuários que não passam por barreiras de autenticação.
 */
export async function protect(options: ProtectOptions): Promise<ValidatedUserSession> {
	const session = await options.locals.auth.validateUser();

	if (session.user === null) {
		return session;
	}

	if (options.barriers) {
		for (const barrier of options.barriers) {
			const barrierResult = await barrier(session, options.event);

			if (!barrierResult.result) {
				barrierResult.onFail();

				if (options.defaultOnBarriersFail) {
					options.defaultOnBarriersFail();
				}

				return session;
			}

			barrierResult.onPass();
		}
	}

	if (options.defaultOnBarriersPass) {
		options.defaultOnBarriersPass();
	}

	return session;
}
