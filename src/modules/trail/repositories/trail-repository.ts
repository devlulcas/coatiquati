import { db } from '@/modules/database/db';
import { trailContributionTable } from '@/modules/database/schema/contribution';
import { trailTable } from '@/modules/database/schema/trail';
import type { PaginationSchemaWithSearch } from '@/modules/database/types/pagination';
import { log } from '@/modules/logging/lib/pino';
import { TOPIC_DB_FIELDS } from '@/modules/topic/repositories/topic-repository';
import { CONTRIBUTOR_DB_FIELDS } from '@/modules/user/repositories/user-repository';
import { eq } from 'drizzle-orm';
import type { NewTrail, Trail, TrailWithTopicArray, UpdateTrail } from '../types/trail';

export type TrailRepository = {
  createTrail: (trail: NewTrail) => Promise<Trail>;
  getTrails: (params: PaginationSchemaWithSearch) => Promise<Trail[]>;
  getTrailById: (id: number) => Promise<Trail>;
  updateTrail: (trail: UpdateTrail) => Promise<Trail>;
  getTrailWithTopicsById: (id: number) => Promise<TrailWithTopicArray>;
};

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

export class DrizzleTrailRepository implements TrailRepository {
  /**
   * Cria uma nova trilha e adiciona o autor como contribuidor
   */
  async createTrail(trail: NewTrail): Promise<Trail> {
    try {
      const newTrail = db.insert(trailTable).values(trail).returning().get();

      const data = await db.query.trailTable.findFirst({
        columns: TRAIL_DB_FIELDS,
        where: (fields, operators) => {
          return operators.eq(fields.id, newTrail.id);
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

      if (!data) {
        throw new Error('Erro ao criar trilha');
      }

      log.debug('Trail created', data);
      return data;
    } catch (error) {
      log.error(error);
      throw new Error('Erro ao criar trilha');
    }
  }

  /**
   * Busca as trilhas com paginação e busca
   */
  async getTrails(params: PaginationSchemaWithSearch): Promise<Trail[]> {
    try {
      const data = db.query.trailTable.findMany({
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

      log.debug('Trails found', data);
      return data;
    } catch (error) {
      log.error(error);
      throw new Error('Erro ao buscar trilhas');
    }
  }

  /**
   * Busca uma trilha pelo id
   */
  async getTrailById(id: number): Promise<Trail> {
    try {
      const data = await db.query.trailTable.findFirst({
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
        },
      });

      if (!data) {
        throw new Error('Trilha não encontrada');
      }

      log.debug('Trail found', data);
      return data;
    } catch (error) {
      log.error(error);
      throw new Error('Erro ao buscar trilhas');
    }
  }

  /**
   * Atualiza uma trilha e a lista de contribuidores
   */
  async updateTrail(trail: UpdateTrail): Promise<Trail> {
    const { contributorId, id, ...updatedData } = { ...trail, updatedAt: new Date().toISOString() };

    return db.transaction(async tx => {
      try {
        tx.update(trailTable).set(updatedData).where(eq(trailTable.id, id)).execute();

        tx.update(trailContributionTable)
          .set({ trailId: id, userId: contributorId })
          .where(eq(trailContributionTable.trailId, id))
          .execute();

        const data = await this.getTrailById(id);

        log.debug('Trail updated', data);

        return data;
      } catch (error) {
        log.error(error);

        tx.rollback();

        throw new Error('Erro ao atualizar trilha');
      }
    });
  }

  /**
   * Busca a trilha e inclui os tópicos relacionados
   */
  async getTrailWithTopicsById(id: number): Promise<TrailWithTopicArray> {
    try {
      const data = await db.query.trailTable.findFirst({
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
        throw new Error('Erro ao buscar trilha');
      }

      log.debug('Trail found', data);
      return data;
    } catch (error) {
      log.error(error);
      throw new Error('Erro ao buscar trilha');
    }
  }
}
