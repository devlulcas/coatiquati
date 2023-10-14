import { db, type Database } from '@/modules/database/db';
import { userTable } from '@/modules/database/schema/user';
import type { PaginationSchemaWithSearch } from '@/modules/database/types/pagination';
import { CATEGORY_DB_FIELDS, TRAIL_DB_FIELDS } from '@/modules/trail/repositories/trail-repository';
import type { UpdateUser, User, UserProfile } from '@/modules/user/types/user';
import { eq } from 'drizzle-orm';
import { userTableToUserMapper } from '../lib/user-table-to-user-mapper';

export type UserRepository = {
  getUsers: (params: PaginationSchemaWithSearch) => Promise<User[]>;
  getUserById: (id: string) => Promise<User | null>;
  getUserProfile: (username: string) => Promise<UserProfile | null>;
  updateUser: (id: string, user: UpdateUser) => Promise<User>;
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
  /**
   * Atualiza os dados do usuário. Apenas dados não sensíveis podem ser atualizados.
   */
  async updateUser(id: string, user: UpdateUser, database = db): Promise<User> {
    const updatedAt = new Date().toISOString();

    try {
      await database
        .update(userTable)
        .set({ ...user, updatedAt })
        .where(eq(userTable.id, id))
        .execute();

      const data = await database.query.userTable.findFirst({ columns: USER_DB_FIELDS });

      if (!data) {
        throw new Error('Usuário não encontrado');
      }

      return userTableToUserMapper(data, false);
    } catch (error) {
      console.error(error);
      throw new Error('Erro ao atualizar usuário');
    }
  }

  /**
   * Busca o usuário pelo id
   */
  async getUserById(id: string, database = db): Promise<User | null> {
    try {
      const data = await database.query.userTable.findFirst({
        columns: USER_DB_FIELDS,
        where: (fields, operators) => operators.eq(fields.id, id),
      });

      if (!data) {
        return null;
      }

      return userTableToUserMapper(data, false);
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  /**
   * Busca os usuários de acordo com os parâmetros
   */
  async getUsers(params: PaginationSchemaWithSearch, database = db): Promise<User[]> {
    const data = await database.query.userTable.findMany({
      columns: USER_DB_FIELDS,
      limit: params.take,
      offset: params.skip,
      where: (fields, operators) => {
        return operators.or(
          operators.like(fields.username, `%${params.search}%`),
          operators.like(fields.email, `%${params.search}%`),
        );
      },
    });

    return data.map(user => userTableToUserMapper(user, true));
  }

  /**
   * Busca o perfil do usuário pelo username
   */
  async getUserProfile(username: string, database = db): Promise<UserProfile | null> {
    try {
      const data = await database.query.userTable.findFirst({
        columns: USER_DB_FIELDS,
        where: (fields, operators) => operators.eq(fields.username, username),
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
        ...userTableToUserMapper(data, true),
        authoredTrails: data.authoredTrails.map(trail => trail),
      };

      return result;
    } catch (error) {
      console.error(error);
      return null;
    }
  }
}
