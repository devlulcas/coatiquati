import { db } from '@/modules/database/db';
import { trailContributionTable } from '@/modules/database/schema/contribution';
import { trailTable } from '@/modules/database/schema/trail';
import type { PaginationSchemaWithSearch } from '@/modules/database/types/pagination';
import { log } from '@/modules/logging/lib/pino';
import { TOPIC_DB_FIELDS } from '@/modules/topic/repositories/topic-repository';
import { CONTRIBUTOR_DB_FIELDS } from '@/modules/user/repositories/user-repository';
import { contentStatus } from '@/shared/constants/content-status';
import { eq } from 'drizzle-orm';
import type { NewTrail, Trail, TrailWithTopicArray, UpdateTrail } from '../types/trail';

export const TRAIL_DB_FIELDS = Object.freeze({
  id: true,
  title: true,
  description: true,
  thumbnail: true,
  status: true,
  createdAt: true,
  updatedAt: true,
});

export const CATEGORY_DB_FIELDS = Object.freeze({
  id: true,
  name: true,
  createdAt: true,
  updatedAt: true,
});

export class TrailRepository {
  /**
   * Cria uma nova trilha e adiciona o autor como contribuidor
   */
  async createTrail(trail: NewTrail, database = db): Promise<Trail> {
    try {
      const newTrail = database.insert(trailTable).values(trail).returning({ id: trailTable.id }).get();
      const data = await this.getTrailById(newTrail.id, database);
      return data;
    } catch (error) {
      log.error('Erro ao criar trilha', { error, trail });
      throw new Error('Erro ao criar trilha');
    }
  }

  /**
   * Habilita uma trilha
   */
  async enableTrail(id: number, database = db): Promise<void> {
    const updatedAt = new Date().toISOString();
    try {
      await database
        .update(trailTable)
        .set({ status: contentStatus.PUBLISHED, updatedAt })
        .where(eq(trailTable.id, id))
        .execute();
    } catch (error) {
      log.error('Erro ao habilitar trilha', { error, id });
      throw new Error('Erro ao habilitar trilha');
    }
  }

  /**
   * Busca uma trilha pelo id
   */
  async getTrailById(id: number, database = db): Promise<Trail> {
    try {
      const data = await database.query.trailTable.findFirst({
        columns: TRAIL_DB_FIELDS,
        where: (fields, operators) => operators.eq(fields.id, id),
        with: {
          author: {
            columns: CONTRIBUTOR_DB_FIELDS,
          },
          contributors: {
            with: {
              user: {
                columns: CONTRIBUTOR_DB_FIELDS,
              },
            },
          },
          category: {
            columns: CATEGORY_DB_FIELDS,
          },
        },
      });

      if (!data) {
        throw new Error('Trilha não encontrada');
      }

      return data;
    } catch (error) {
      log.error('Erro ao buscar a trilha desejada', { error, id });
      throw new Error('Erro ao buscar a trilha desejada');
    }
  }

  /**
   * Busca as trilhas com paginação e busca
   */
  async getTrails(params: PaginationSchemaWithSearch, database = db): Promise<Trail[]> {
    try {
      const data = database.query.trailTable.findMany({
        columns: TRAIL_DB_FIELDS,
        limit: params.take,
        offset: params.skip,
        where: (fields, operators) => {
          return operators.or(
            operators.like(fields.title, `%${params.search}%`),
            operators.like(fields.description, `%${params.search}%`),
          );
        },
        with: {
          author: {
            columns: CONTRIBUTOR_DB_FIELDS,
          },
          contributors: {
            with: {
              user: {
                columns: CONTRIBUTOR_DB_FIELDS,
              },
            },
          },
          category: {
            columns: CATEGORY_DB_FIELDS,
          },
        },
      });

      return data;
    } catch (error) {
      log.error('Erro ao buscar trilhas', { error, params });
      throw new Error('Erro ao buscar trilhas');
    }
  }

  /**
   * Busca a trilha e inclui os tópicos relacionados
   */
  async getTrailWithTopicsById(id: number, database = db): Promise<TrailWithTopicArray> {
    try {
      const data = await database.query.trailTable.findFirst({
        columns: TRAIL_DB_FIELDS,
        where: (fields, operators) => {
          return operators.eq(fields.id, id);
        },
        with: {
          author: {
            columns: CONTRIBUTOR_DB_FIELDS,
          },
          contributors: {
            with: {
              user: {
                columns: CONTRIBUTOR_DB_FIELDS,
              },
            },
          },
          category: {
            columns: CATEGORY_DB_FIELDS,
          },
          topics: {
            columns: TOPIC_DB_FIELDS,
            with: {
              author: {
                columns: CONTRIBUTOR_DB_FIELDS,
              },
              contributors: {
                with: {
                  user: {
                    columns: CONTRIBUTOR_DB_FIELDS,
                  },
                },
              },
            },
          },
        },
      });

      if (!data) {
        throw new Error('Trilha não encontrada');
      }

      return data;
    } catch (error) {
      log.error('Erro ao buscar a trilha desejada', { error, id });
      throw new Error('Erro ao buscar trilha');
    }
  }

  /**
   * Atualiza uma trilha e a lista de contribuidores
   */
  async updateTrail(trail: UpdateTrail, database = db): Promise<Trail> {
    const { contributorId, id, ...updatedData } = trail;
    const updatedAt = new Date().toISOString();

    return database.transaction(async tx => {
      try {
        tx.update(trailTable)
          .set({ ...updatedData, updatedAt })
          .where(eq(trailTable.id, id))
          .execute();

        tx.update(trailContributionTable)
          .set({ trailId: id, userId: contributorId, contributedAt: updatedAt })
          .where(eq(trailContributionTable.trailId, id))
          .execute();

        const data = await this.getTrailById(id, tx);

        return data;
      } catch (error) {
        log.error('Erro ao atualizar trilha', { error, trail });
        tx.rollback();
        throw new Error('Erro ao atualizar trilha');
      }
    });
  }

  /**
   * Omite uma trilha
   */
  async omitTrail(id: number, database = db): Promise<void> {
    const updatedAt = new Date().toISOString();
    try {
      await database
        .update(trailTable)
        .set({ status: contentStatus.DRAFT, updatedAt })
        .where(eq(trailTable.id, id))
        .execute();
    } catch (error) {
      log.error('Erro ao omitir trilha', { error, id });
      throw new Error('Erro ao omitir trilha');
    }
  }
}
