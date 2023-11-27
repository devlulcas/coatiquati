import { createPaginationSchemaWithSearch, type PaginationSchemaWithSearch } from '@/modules/database/types/pagination';
import { TrailCategoryRepository } from '../repositories/trail-category-repository';

export class SearchTrailCategoriesUseCase {
  constructor(private readonly trailCategoryRepository: TrailCategoryRepository = new TrailCategoryRepository()) {}

  async execute(params?: Partial<PaginationSchemaWithSearch>) {
    const validatedParams = createPaginationSchemaWithSearch(42, 0).optional().safeParse(params);

    if (!validatedParams.success) {
      throw new Error('Falha ao buscar categorias.');
    }

    return this.trailCategoryRepository.getCategories(validatedParams.data);
  }
}
