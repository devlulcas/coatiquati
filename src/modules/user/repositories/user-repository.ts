import { db } from '@/modules/database/db';
import { userTable } from '@/modules/database/schema/user';
import type { PaginationSchemaWithSearch } from '@/modules/database/types/pagination';
import { log } from '@/modules/logging/lib/pino';
import { CATEGORY_DB_FIELDS, TRAIL_DB_FIELDS } from '@/modules/trail/repositories/trail-repository';
import type { UpdateUser, User, UserProfile } from '@/modules/user/types/user';
import { eq } from 'drizzle-orm';

export const USER_DB_FIELDS = Object.freeze({
  avatar: true,
  createdAt: true,
  email: true,
  id: true,
  isBanned: true,
  role: true,
  updatedAt: true,
  username: true,
  verified: true,
});

export const CONTRIBUTOR_DB_FIELDS = Object.freeze({
  id: true,
  username: true,
  avatar: true,
});

export class UserRepository {
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

      return data;
    } catch (error) {
      log.error(error);
      throw new Error('Erro ao atualizar usuário');
    }
  }

  async getUserById(id: string, database = db): Promise<User | null> {
    try {
      const data = await database.query.userTable.findFirst({
        columns: USER_DB_FIELDS,
        where: (fields, operators) => operators.eq(fields.id, id),
      });

      if (!data) {
        return null;
      }

      return data;
    } catch (error) {
      log.error(error);
      return null;
    }
  }

  async getUsers(params: PaginationSchemaWithSearch, database = db): Promise<User[]> {
    return database.query.userTable.findMany({
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
  }

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
        log.warn(`User ${username} not found`);
        return null;
      }

      const result: UserProfile = {
        ...data,
        authoredTrails: data.authoredTrails.map(trail => trail),
      };

      return result;
    } catch (error) {
      log.error(error);
      return null;
    }
  }
}
