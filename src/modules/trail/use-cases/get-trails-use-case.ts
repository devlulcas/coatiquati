import { db } from '@/modules/database/db';
import { trailTable } from '@/modules/database/schema/trail';
import { userTable } from '@/modules/database/schema/user';
import type { User } from '@/modules/user/types/user';
import { eq, like, or } from 'drizzle-orm';
import { z } from 'zod';
import { type Trail } from '../types/trail';

const getTrailsUseCaseSchema = z.object({
  limit: z.number().optional().default(10),
  offset: z.number().optional().default(0),
  search: z.string().optional().default(''),
});

type GetTrailsUseCaseSchema = Partial<z.infer<typeof getTrailsUseCaseSchema>>;

export async function getTrailsUseCase(
  params: GetTrailsUseCaseSchema
): Promise<{ trail: Trail; author: User }[]> {
  const validatedParams = getTrailsUseCaseSchema.safeParse(params);

  if (!validatedParams.success) {
    throw new Error('Parâmetros inválidos');
  }

  const { limit, offset, search } = validatedParams.data;

  try {
    const data = db
      .select()
      .from(trailTable)
      .where(
        or(
          like(trailTable.title, `%${search}%`),
          like(trailTable.description, `%${search}%`)
        )
      )
      .innerJoin(userTable, eq(userTable.id, trailTable.authorId))
      .limit(limit)
      .offset(offset)
      .all();

    return data.map((item) => ({ trail: item.trail, author: item.user }));
  } catch (error) {
    console.error(error);
    throw new Error('Erro ao buscar trilhas');
  }
}
