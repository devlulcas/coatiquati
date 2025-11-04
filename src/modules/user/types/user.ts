import { getRole, type Role } from '@/modules/auth/lib/auth-client';
import type { SelectUser } from '@/modules/database/schema/auth';

export const CONTRIBUTOR_COLUMNS = {
  id: true,
  name: true,
  image: true,
  username: true,
} satisfies Partial<Record<keyof SelectUser, true>>;

export type Contributor = {
  id: string;
  name: string;
  image: string;
  username: string;
};

// Parece inútil, mas limita a quantidade de campos passados adiante
export function mapToContributor(
  data: Pick<SelectUser, keyof typeof CONTRIBUTOR_COLUMNS>
): Contributor {
  return {
    id: data.id,
    name: data.name,
    image: data.image,
    username: data.username,
  };
}

export const PUBLIC_USER_COLUMNS = {
  id: true,
  username: true,
  name: true,
  image: true,
  banned: true,
  createdAt: true,
  role: true,
} satisfies Partial<Record<keyof SelectUser, true>>;

export type PublicUser = {
  id: string;
  username: string;
  name: string;
  image: string;
  banned: boolean;
  createdAt: Date;
  role: Role;
};

export function mapToPublicUser(
  data: Pick<SelectUser, keyof typeof PUBLIC_USER_COLUMNS>
): PublicUser {
  return {
    id: data.id,
    username: data.username,
    name: data.name,
    image: data.image,
    banned: Boolean(data.banned),
    createdAt: data.createdAt,
    role: getRole(data.role),
  };
}
