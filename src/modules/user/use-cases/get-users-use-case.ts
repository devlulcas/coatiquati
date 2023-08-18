import { db } from '@/modules/database/db';
import { userTable } from '@/modules/database/schema/user';
import { like, or } from 'drizzle-orm';
import { z } from 'zod';
import { type User } from '../types/user';

const getUsersUseCaseSchema = z.object({
  limit: z.number().optional().default(10),
  offset: z.number().optional().default(0),
  search: z.string().optional().default(''),
});

type GetUsersUseCaseSchema = Partial<z.infer<typeof getUsersUseCaseSchema>>;

export async function getUsersUseCase(
  params: GetUsersUseCaseSchema
): Promise<User[]> {
  const validatedParams = getUsersUseCaseSchema.safeParse(params);

  if (!validatedParams.success) {
    throw new Error('Parâmetros inválidos');
  }

  const { limit, offset, search } = validatedParams.data;

  try {
    const data = db
      .select()
      .from(userTable)
      .where(
        or(
          like(userTable.username, `%${search}%`),
          like(userTable.email, `%${search}%`)
        )
      )
      .limit(limit)
      .offset(offset)
      .all();

    return data;
  } catch (error) {
    console.error(error);
    throw new Error('Erro ao buscar usuários');
  }
}
