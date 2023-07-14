export const Roles = Object.freeze({
	USER: 'USER',
	ADMIN: 'ADMIN'
});

export const roles = Object.freeze(Object.values(Roles));

export type Role = (typeof roles)[number];

function userRolesHasRole(role: Role, userRoles?: string[]) {
	return userRoles?.includes(role);
}

export function isAdministrator(userRoles?: string[]) {
	return userRolesHasRole(Roles.ADMIN, userRoles);
}
