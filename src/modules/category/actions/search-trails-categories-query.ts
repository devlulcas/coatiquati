'use server';

import { createPaginationSchemaWithSearch, type PaginationSchemaWithSearch } from '@/modules/database/types/pagination';
import { asyncResult, fail, type Result } from '@/shared/lib/result';
import { TrailCategoryRepository } from '../repositories/trail-category-repository';
import type { TrailCategory } from '../types/trail-category';

export async function searchTrailCategoriesQuery(
  params?: Partial<PaginationSchemaWithSearch>,
): Promise<Result<TrailCategory[]>> {
  const validatedParams = createPaginationSchemaWithSearch(42, 0).optional().safeParse(params);

  if (!validatedParams.success) {
    return fail('Falha ao buscar categorias.');
  }

  const trailCategoryRepository = new TrailCategoryRepository();

  return asyncResult(trailCategoryRepository.getCategories(validatedParams.data));
}
