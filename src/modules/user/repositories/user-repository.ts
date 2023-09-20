import type { Role } from '@/modules/auth/constants/roles';
import { db } from '@/modules/database/db';
import { userTable } from '@/modules/database/schema/user';
import type { PaginationSchemaWithSearch } from '@/modules/database/types/pagination';
import {
  CATEGORY_DB_FIELDS,
  TRAIL_DB_FIELDS,
} from '@/modules/trail/repositories/trail-repository';
import type { User, UserProfile } from '@/modules/user/types/user';
import { eq } from 'drizzle-orm';

export type UserRepository = {
  getUsers: (params: PaginationSchemaWithSearch) => Promise<User[]>;
  getUserProfile: (username: string) => Promise<UserProfile | null>;
  setUserRole: (userId: string, role: Role) => Promise<User>;
};

export const USER_DB_FIELDS = Object.freeze({
  id: true,
  username: true,
  avatar: true,
  email: true,
  email_verified: true,
  createdAt: true,
  updatedAt: true,
  role: true,
});

export const CONTRIBUTOR_DB_FIELDS = Object.freeze({
  id: true,
  username: true,
  avatar: true,
});

export class DrizzleUserRepository implements UserRepository {
  async getUsers(params: PaginationSchemaWithSearch): Promise<User[]> {
    const data = await db.query.userTable.findMany({
      columns: USER_DB_FIELDS,
      limit: params.take,
      offset: params.skip,
      where: (fields, operators) => {
        return operators.or(
          operators.like(fields.username, `%${params.search}%`),
          operators.like(fields.email, `%${params.search}%`)
        );
      },
    });

    return data.map((user) => ({
      ...user,
      emailVerified: Boolean(user.email_verified),
    }));
  }

  async getUserProfile(username: string): Promise<UserProfile | null> {
    try {
      const data = await db.query.userTable.findFirst({
        columns: USER_DB_FIELDS,
        where: (fields, operators) => {
          return operators.eq(fields.username, username);
        },
        with: {
          authoredTrails: {
            columns: TRAIL_DB_FIELDS,
            with: {
              author: {
                columns: CONTRIBUTOR_DB_FIELDS,
              },
              contributors: {
                with: {
                  user: {
                    columns: CONTRIBUTOR_DB_FIELDS,
                  },
                },
              },
              category: {
                columns: CATEGORY_DB_FIELDS,
              },
            },
          },
        },
      });

      if (!data) {
        return null;
      }

      const result: UserProfile = {
        ...data,
        emailVerified: Boolean(data.email_verified),
        authoredTrails: data.authoredTrails.map((trail) => ({
          ...trail,
        })),
      };

      return result;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  async setUserRole(userId: string, role: Role): Promise<User> {
    const now = new Date().toISOString();

    try {
      await db
        .update(userTable)
        .set({ role, updatedAt: now })
        .where(eq(userTable.id, userId))
        .execute();

      const data = await db.query.userTable.findFirst({
        columns: USER_DB_FIELDS,
      });

      if (!data) {
        throw new Error('Usuário não encontrado');
      }

      return { ...data, emailVerified: Boolean(data.email_verified) };
    } catch (error) {
      console.error(error);
      throw new Error('Erro ao atualizar usuário');
    }
  }
}
