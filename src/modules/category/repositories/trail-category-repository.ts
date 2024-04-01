import { db } from '@/modules/database/db';
import { categoryTable } from '@/modules/database/schema/trail';
import type { PaginationSchemaWithSearch } from '@/modules/database/types/pagination';
import { log } from '@/modules/logging/lib/pino';
import { like } from 'drizzle-orm';
import type { NewTrailCategorySchema } from '../schemas/new-trail-category-schema';
import type { TrailCategory } from '../types/trail-category';

export class TrailCategoryRepository {
  async upsertCategory(category: NewTrailCategorySchema): Promise<void> {
    try {
      await db
        .insert(categoryTable)
        .values({ name: category.name, authorId: category.authorId })
        .onConflictDoNothing()
        .execute();
    } catch (error) {
      log.error('Falha ao inserir categoria.', { error });
      throw new Error('Falha ao inserir categoria.');
    }
  }

  async getCategories(params?: Partial<PaginationSchemaWithSearch>): Promise<TrailCategory[]> {
    const search = params?.search || null;
    const skip = params?.skip || 0;
    const take = params?.take || 40;

    try {
      let query = db.select({ name: categoryTable.name }).from(categoryTable).offset(skip).limit(take).$dynamic();

      if (search) {
        query = query.where(like(categoryTable.name, `%${search}%`));
      }

      return query.all();
    } catch (error) {
      log.error('Falha ao buscar categorias.', { error });
      throw new Error('Falha ao buscar categorias.');
    }
  }
}
