import type { Role } from './modules/user/constants/user-roles';

// src/app.d.ts
declare global {
	namespace App {
		interface Locals {
			auth: import('lucia-auth').AuthRequest;
		}
	}

	// eslint-disable-next-line no-var
	var prisma: PrismaClient;
}

/// <reference types="lucia-auth" />
declare global {
	namespace Lucia {
		type Auth = import('$lib/server/auth').Auth;
		type UserAttributes = {
			username: string;
			roles: Role[];
			email: string;
			name?: string;
		};
	}
}

export {};
