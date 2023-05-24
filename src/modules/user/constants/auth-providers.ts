export const AuthProviders = Object.freeze({
	USERNAME: 'username',
	GOOGLE: 'google'
});

export const authProviders = Object.freeze(Object.values(AuthProviders));

export type AuthProvider = (typeof authProviders)[number];
