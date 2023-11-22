import { db } from '@/modules/database/db';
import { categoryTable } from '@/modules/database/schema/trail';
import { log } from '@/modules/logging/lib/pino';
import { like } from 'drizzle-orm';
import type { NewTrailCategorySchema } from '../schemas/new-trail-category-schema';
import type { TrailCategory } from '../types/trail-category';

export class TrailCategoryRepository {
  async upsertCategory(category: NewTrailCategorySchema, database = db): Promise<void> {
    try {
      await database
        .insert(categoryTable)
        .values({ name: category.name, authorId: category.authorId })
        .onConflictDoNothing()
        .execute();
    } catch (error) {
      log.error('Falha ao inserir categoria.', { error });
      throw new Error('Falha ao inserir categoria.');
    }
  }

  async getCategories(params: { search: string }, database = db): Promise<TrailCategory[]> {
    try {
      return database
        .select({ name: categoryTable.name })
        .from(categoryTable)
        .where(like(categoryTable.name, params.search))
        .all();
    } catch (error) {
      log.error('Falha ao buscar categorias.', { error });
      throw new Error('Falha ao buscar categorias.');
    }
  }
}
