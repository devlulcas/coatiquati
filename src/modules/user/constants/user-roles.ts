export const Roles = Object.freeze({
	USER: 'USER',
	ADMIN: 'ADMIN'
});

export const roles = Object.freeze(Object.values(Roles));

export type Role = (typeof roles)[number];
