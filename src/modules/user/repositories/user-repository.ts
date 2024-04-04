import { db } from '@/modules/database/db';
import { userTable } from '@/modules/database/schema/user';
import type { PaginationSchemaWithSearch } from '@/modules/database/types/pagination';
import { log } from '@/modules/logging/lib/pino';
import type { UpdateUser, User, UserProfile } from '@/modules/user/types/user';
import { eq } from 'drizzle-orm';

export class UserRepository {
  async updateUser(id: string, user: UpdateUser): Promise<void> {
    try {
      await db.update(userTable).set(user).where(eq(userTable.id, id)).execute();
    } catch (error) {
      log.error('Erro ao atualizar usuário', error);
      throw new Error('Erro ao atualizar usuário');
    }
  }

  async getUserById(id: string): Promise<User | null> {
    try {
      const data = await db.query.userTable.findFirst({
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

  async getUsers(params: PaginationSchemaWithSearch): Promise<User[]> {
    return db.query.userTable.findMany({
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

  async getUserProfile(username: string): Promise<UserProfile | null> {
    try {
      const data = await db.query.userTable.findFirst({
        where: (fields, operators) => operators.eq(fields.username, username),
        with: {
          authoredTrails: {
            with: {
              author: true,
              contributors: {
                with: {
                  user: true,
                },
              },
              category: true,
            },
          },
        },
      });

      if (!data) {
        log.warn(`User ${username} not found`);
        return null;
      }

      return data;
    } catch (error) {
      log.error(error);
      return null;
    }
  }
}
