import { db } from '@/modules/database/db';
import { trailTable } from '@/modules/database/schema/trail';
import type { PaginationSchemaWithSearch } from '@/modules/database/types/pagination';
import { TOPIC_DB_FIELDS } from '@/modules/topic/repositories/topic-repository';
import { CONTRIBUTOR_DB_FIELDS } from '@/modules/user/repositories/user-repository';
import { eq } from 'drizzle-orm';
import type { NewTrail, Trail, TrailWithTopicArray } from '../types/trail';

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

export function createTrailRepository(): TrailRepository {
  return {
    createTrail,
    getTrailWithTopicsById,
    getTrails,
    updateTrail,
  };
}

async function createTrail(trail: NewTrail): Promise<Trail> {
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

async function getTrails(params: PaginationSchemaWithSearch): Promise<Trail[]> {
  try {
    return db.query.trailTable.findMany({
      columns: TRAIL_DB_FIELDS,
      limit: params.take,
      offset: params.skip,
      where: (fields, operators) => {
        return operators.or(
          operators.like(fields.title, `%${params.search}%`),
          operators.like(fields.description, `%${params.search}%`)
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

async function updateTrail(
  id: number,
  trail: Partial<NewTrail>
): Promise<Trail> {
  try {
    const updatedTrail = db
      .update(trailTable)
      .set({ ...trail, updatedAt: new Date().toISOString() })
      .where(eq(trailTable.id, id))
      .returning()
      .get();

    const data = await db.query.trailTable.findFirst({
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
    throw new Error('Erro ao atualizar trilha');
  }
}

async function getTrailWithTopicsById(
  id: number
): Promise<TrailWithTopicArray> {
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
