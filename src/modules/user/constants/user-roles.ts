export const ROLES = Object.freeze({
	user: 'USER',
	admin: 'ADMIN'
});

export const ROLE_LIST = Object.freeze(Object.values(ROLES));

export type Role = (typeof ROLE_LIST)[number];

function userRolesHasRole(role: Role, userRoles?: string[]) {
	return userRoles?.includes(role);
}

export function isAdministrator(userRoles?: string[]) {
	return userRolesHasRole(ROLES.admin, userRoles);
}
