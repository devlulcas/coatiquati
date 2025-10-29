'use server';

import { db } from '@/modules/database/db';
import { categories } from '@/modules/database/schema/category';
import {
  createPaginationSchemaWithSearch,
  type PaginationSchemaWithSearch,
} from '@/modules/database/types/pagination';
import { fail, type Result, wrapAsyncInResult } from '@/shared/lib/result';
import { like } from 'drizzle-orm';
import type { TrailCategory } from '../types/trail-category';

export async function searchTrailCategoriesQuery(
  params?: Partial<PaginationSchemaWithSearch>
): Promise<Result<TrailCategory[]>> {
  const validatedParams = createPaginationSchemaWithSearch(42, 0)
    .optional()
    .safeParse(params);

  if (!validatedParams.success) {
    return fail('Falha ao buscar categorias.');
  }

  const search = params?.search || null;
  const skip = params?.skip || 0;
  const take = params?.take || 40;

  let query = db
    .select({ name: categories.name })
    .from(categories)
    .offset(skip)
    .limit(take)
    .$dynamic();

  if (search) {
    query = query.where(like(categories.name, `%${search}%`));
  }

  return wrapAsyncInResult(query.all());
}
