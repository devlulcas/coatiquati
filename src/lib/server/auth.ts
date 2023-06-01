import { dev } from '$app/environment';
import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REDIRECT_URI } from '$env/static/private';
import prisma from '@lucia-auth/adapter-prisma';
import { google } from '@lucia-auth/oauth/providers';
import { PrismaClient } from '@prisma/client';
import lucia from 'lucia-auth';
import { sveltekit } from 'lucia-auth/middleware';

export const auth = lucia({
	adapter: prisma(new PrismaClient()),
	env: dev ? 'DEV' : 'PROD',
	middleware: sveltekit(),
	transformDatabaseUser: (user) => ({
		id: user.id,
		username: user.username,
		roles: user.roles
	})
});

export type Auth = typeof auth;

export const GOOGLE_OAUTH_STATE_COOKIE_NAME = 'google-oauth-state';
export const googleAuth = google(auth, {
	clientId: GOOGLE_CLIENT_ID,
	clientSecret: GOOGLE_CLIENT_SECRET,
	redirectUri: GOOGLE_REDIRECT_URI
});
