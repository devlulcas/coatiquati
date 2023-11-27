import type { PaginationSchemaWithSearch } from '@/modules/database/types/pagination';
import { useQuery } from '@tanstack/react-query';
import type { TrailCategory } from '../types/trail-category';

export const TRAIL_CATEGORY_SEARCH_QUERY_KEY = 'TRAIL_CATEGORY_SEARCH_QUERY_KEY';

type TrailCategorySearchQueryOptions = {
  initialData?: TrailCategory[];
} & Partial<PaginationSchemaWithSearch>;

async function fetchTrailCategories(options?: Partial<PaginationSchemaWithSearch>): Promise<unknown> {
  const url = new URL('/api/categories', window.location.origin);

  if (options?.skip) {
    url.searchParams.set('skip', String(options.skip));
  }

  if (options?.take) {
    url.searchParams.set('take', String(options.take));
  }

  if (options?.search) {
    url.searchParams.set('search', options.search);
  }

  const response = await fetch(url.toString(), {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'GET',
  });

  return response.json();
}

type TrailCategorySearchResponse = { data: { categories: TrailCategory[] } };

export function useTrailCategorySearchQuery(options?: TrailCategorySearchQueryOptions) {
  return useQuery<TrailCategory[], Error>({
    queryKey: [TRAIL_CATEGORY_SEARCH_QUERY_KEY, options],
    queryFn: async () => {
      const result = await fetchTrailCategories(options);

      const isCategoryData = (result: any): result is TrailCategorySearchResponse => {
        return typeof result === 'object' && result !== null && 'data' in result;
      };

      if (!isCategoryData(result)) {
        throw new Error('Invalid category data');
      }

      return result.data.categories;
    },
    initialData: options?.initialData ?? [],
  });
}
