export const AUTH_PROVIDERS = Object.freeze({
	USERNAME: 'username',
	GOOGLE: 'google'
});

export const authProviders = Object.freeze(Object.values(AUTH_PROVIDERS));

export type AuthProvider = (typeof authProviders)[number];
