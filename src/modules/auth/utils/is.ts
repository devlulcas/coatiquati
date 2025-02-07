import { roles, type Role } from '../constants/roles';

export const isAdmin = (role: string | null | undefined): role is Role => {
  return role === roles.ADMIN;
};

export const isUser = (role: string | null | undefined) => {
  return role === roles.USER;
};

export const isHighPrivilegeAdmin = (role: string | null | undefined): role is Role => {
  return role === roles.HIGH_PRIVILEGE_ADMIN;
};

export const isAuthenticated = <T>(sessionOrUser?: T | null): sessionOrUser is T => {
  if (!sessionOrUser) return false;
  return sessionOrUser !== null;
};

export const isAdminOrAbove = (role: string | null | undefined): role is Role => {
  return role === roles.ADMIN || role === roles.HIGH_PRIVILEGE_ADMIN;
};

export function hasPermission(perm: string, required: Role[]) {
  return (required as string[]).includes(perm);
}
