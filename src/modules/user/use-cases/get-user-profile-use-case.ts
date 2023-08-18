import { userSignInSchema } from '@/modules/auth/schemas/user-sign-in-schema';
import { db } from '@/modules/database/db';
import { trailTable } from '@/modules/database/schema/trail';
import { userTable } from '@/modules/database/schema/user';
import { type Trail } from '@/modules/trail/types/trail';
import { eq } from 'drizzle-orm';
import { z } from 'zod';
import { type User } from '../types/user';

const getUserProfileUseCaseSchema = userSignInSchema.pick({
  username: true,
});

type GetUserProfileUseCaseSchema = z.infer<typeof getUserProfileUseCaseSchema>;

type Result = {
  user: User;
  trailsAuthored: Trail[];
};

export async function getUserProfileUseCase(
  params: GetUserProfileUseCaseSchema
): Promise<Result> {
  const validatedParams = getUserProfileUseCaseSchema.safeParse(params);

  if (!validatedParams.success) {
    throw new Error('Parâmetros inválidos');
  }

  const { username } = validatedParams.data;

  try {
    const user = db
      .select()
      .from(userTable)
      .where(eq(userTable.username, username))
      .get();

    if (!user) {
      throw new Error('Usuário não encontrado');
    }

    const data = db
      .select()
      .from(userTable)
      .innerJoin(trailTable, eq(trailTable.authorId, user.id))
      .all();

    const trailsAuthored: Trail[] = [];

    for (const item of data) {
      if (trailsAuthored.find((trail) => trail.id === item.trail.id)) {
        continue;
      }

      trailsAuthored.push(item.trail);
    }

    return { user, trailsAuthored };
  } catch (error) {
    console.error(error);
    throw new Error('Erro ao buscar usuários');
  }
}
