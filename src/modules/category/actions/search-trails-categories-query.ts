'use server';
import { db } from '@/modules/database/db';
import { categories } from '@/modules/database/schema/category';
import { fail, wrapAsyncInResult } from '@/shared/lib/result';
import { paginationSchema } from '@/shared/schemas/pagination';
import { desc, ilike } from 'drizzle-orm';
import z from 'zod';

const schema = paginationSchema.extend({
  search: z.union([z.string(), z.null(), z.undefined()]).optional(),
});

export async function searchTrailCategoriesQuery(
  params: z.infer<typeof schema>
) {
  const validatedParams = schema.safeParse(params);

  if (!validatedParams.success) {
    return fail('Falha ao buscar categorias.');
  }

  const search = validatedParams.data.search || null;
  const skip = validatedParams.data.skip;
  const take = validatedParams.data.take;

  const query = db
    .select()
    .from(categories)
    .where(search ? ilike(categories.name, `%${search}%`) : undefined)
    .offset(skip)
    .limit(take)
    .orderBy(desc(categories.updatedAt))
    .$dynamic();

  return wrapAsyncInResult(query.execute());
}
