import { roles } from '../constants/roles';

export const isAdmin = (role: string) => {
  return role === roles.ADMIN;
};

export const isUser = (role: string) => {
  return role === roles.USER;
};

export const isHighPrivilegeAdmin = (role: string) => {
  return role === roles.HIGH_PRIVILEGE_ADMIN;
};

export const isAdminOrAbove = (role: string) => {
  return role === roles.ADMIN || role === roles.HIGH_PRIVILEGE_ADMIN;
};
