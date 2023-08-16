import { userSignInSchema } from '@/modules/auth/schemas/user-sign-in-schema';
import { db } from '@/modules/database/db';
import {
  trailContributorTable,
  trailTable,
} from '@/modules/database/schema/trail';
import { userTable } from '@/modules/database/schema/user';
import { Trail } from '@/modules/trail/types/trail';
import { eq } from 'drizzle-orm';
import { z } from 'zod';
import { User } from '../types/user';

const getUserProfileUseCaseSchema = userSignInSchema.pick({
  username: true,
});

type Params = z.infer<typeof getUserProfileUseCaseSchema>;

type Result = {
  user: User;
  trailsAuthored: Trail[];
};

export async function getUserProfileUseCase(params: Params): Promise<Result> {
  const validatedParams = getUserProfileUseCaseSchema.safeParse(params);

  if (!validatedParams.success) {
    throw new Error('Parâmetros inválidos');
  }

  const { username } = validatedParams.data;
  // SELECT m.name, cp.id_category
  // FROM manufacturer as m
  // INNER JOIN product as p
  //     ON m.id_manufacturer = p.id_manufacturer
  // INNER JOIN category_product as cp
  //     ON p.id_product = cp.id_product
  // WHERE cp.id_category = 'some value'
  try {
    const data = db
      .select()
      .from(userTable)
      .innerJoin(trailTable, eq(trailTable.authorId, userTable.id))
      .innerJoin(
        trailContributorTable,
        eq(trailTable.id, trailContributorTable.trailId)
      )
      .where(eq(trailContributorTable.userUsername, username))
      .get();

    console.table(data);

    throw new Error('Erro ao buscar usuários');
    // return data;
  } catch (error) {
    console.error(error);
    throw new Error('Erro ao buscar usuários');
  }
}
