import { roles } from '../constants/roles';
import type { Session } from '../types/session';

export const isAdmin = (role: string) => {
  return role === roles.ADMIN;
};

export const isUser = (role: string) => {
  return role === roles.USER;
};

export const isHighPrivilegeAdmin = (role: string) => {
  return role === roles.HIGH_PRIVILEGE_ADMIN;
};

export const isAuthenticated = (session?: Session | null): session is Session => {
  if (!session) return false;
  return session.userId !== null;
};

export const isAdminOrAbove = (role: string) => {
  return role === roles.ADMIN || role === roles.HIGH_PRIVILEGE_ADMIN;
};
