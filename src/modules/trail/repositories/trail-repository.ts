import { db } from '@/modules/database/db';
import { trailTable } from '@/modules/database/schema/trail';
import type { PaginationSchemaWithSearch } from '@/modules/database/types/pagination';
import { TOPIC_DB_FIELDS } from '@/modules/topic/repositories/topic-repository';
import { CONTRIBUTOR_DB_FIELDS } from '@/modules/user/repositories/user-repository';
import { eq } from 'drizzle-orm';
import type { NewTrail, Trail, TrailWithTopicArray } from '../types/trail';
import { trailContributionTable } from '@/modules/database/schema/contribution';

export type TrailRepository = {
  createTrail: (trail: NewTrail) => Promise<Trail>;
  getTrails: (params: PaginationSchemaWithSearch) => Promise<Trail[]>;
  updateTrail: (id: number, trail: Partial<NewTrail>) => Promise<Trail>;
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

      return data;
    } catch (error) {
      console.error(error);
      throw new Error('Erro ao criar trilha');
    }
  }

  async getTrails(params: PaginationSchemaWithSearch): Promise<Trail[]> {
    try {
      return db.query.trailTable.findMany({
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
    } catch (error) {
      console.error(error);
      throw new Error('Erro ao buscar trilhas');
    }
  }

  async updateTrail(id: number, trail: Partial<NewTrail>): Promise<Trail> {
    return db.transaction(async tx => {
      try {
        const {authorId, ...updatedData} = { ...trail, updatedAt: new Date().toISOString() }

        if (!authorId) {
          throw new Error('Autor não informado');
        }

        // Atualiza a trilha em si
        const updatedTrail = tx
          .update(trailTable)
          .set(updatedData)
          .where(eq(trailTable.id, id))
          .returning()
          .get();

        // Atualiza a lista de contribuidores
        tx.update(trailContributionTable)
          .set({ trailId: updatedTrail.id, userId: authorId })
          .where(eq(trailContributionTable.trailId, id))
          .execute();

        const data = await tx.query.trailTable.findFirst({
          columns: TRAIL_DB_FIELDS,
          where: (fields, operators) => {
            return operators.eq(fields.id, updatedTrail.id);
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
          throw new Error('Erro ao atualizar trilha');
        }

        return data;
      } catch (error) {
        console.error(error);
        tx.rollback();
        throw new Error('Erro ao atualizar trilha');
      }
    });
  }

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

      return data;
    } catch (error) {
      console.error(error);
      throw new Error('Erro ao buscar trilha');
    }
  }
}
