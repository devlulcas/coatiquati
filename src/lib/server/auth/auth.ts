import { dev } from '$app/environment';
import { pg } from '@lucia-auth/adapter-postgresql';
import lucia from 'lucia-auth';
import { sveltekit } from 'lucia-auth/middleware';
import { pool } from '../db';

export const auth = lucia({
	adapter: pg(pool),
	env: dev ? 'DEV' : 'PROD',
	middleware: sveltekit(),
	transformDatabaseUser: (user) => ({
		id: user.id,
		username: user.username,
		roles: user.roles
	})
});

export type Auth = typeof auth;
