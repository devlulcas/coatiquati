export const roles = {
  ADMIN: 'ADMIN',
  USER: 'USER',
  HIGH_PRIVILEGE_ADMIN: 'HIGH_PRIVILEGE_ADMIN',
} as const;

export type Role = (typeof roles)[keyof typeof roles];
