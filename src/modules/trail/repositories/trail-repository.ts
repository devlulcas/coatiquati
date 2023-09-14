import { db } from '@/modules/database/db';
import { trailTable } from '@/modules/database/schema/trail';
import type { PaginationSchema } from '@/modules/database/types/pagination';
import { eq, ilike } from 'drizzle-orm';
import type { NewTrail } from '../types/trail';

async function createTrail(trail: NewTrail) {
  try {
    return db.insert(trailTable).values(trail).returning().get();
  } catch (error) {
    console.error(error);
    throw new Error('Erro ao criar trilha');
  }
}

type GetTrailsParams = PaginationSchema & {
  query?: string;
};

async function getTrails(params: GetTrailsParams) {
  const { take, skip, query } = params || {
    take: 15,
    skip: 0,
  };

  try {
    return db.query.trailTable.findMany({
      limit: take,
      offset: skip,
      orderBy: (trail) => trail.updatedAt,
      where: (fields, operators) => {
        if (query) {
          return operators.or(
            ilike(fields.title, `%${query}%`),
            ilike(fields.description, `%${query}%`)
          );
        }
      },
      columns: {
        id: true,
        title: true,
        description: true,
        thumbnail: true,
        updatedAt: true,
        createdAt: true,
        status: true,
      },
      with: {
        author: {
          columns: { id: true, username: true, avatar: true },
        },
        contributors: {
          with: {
            user: { columns: { id: true, username: true, avatar: true } },
          },
        },
        category: {
          columns: { id: true, name: true },
        },
      },
    });
  } catch (error) {
    console.error(error);
    throw new Error('Erro ao buscar trilhas');
  }
}

async function getTrailById(id: number) {
  try {
    return db.query.trailTable.findFirst({
      columns: {
        id: true,
        title: true,
        description: true,
        thumbnail: true,
        updatedAt: true,
        createdAt: true,
        status: true,
      },
      with: {
        author: {
          columns: { id: true, username: true, avatar: true },
        },
        contributors: {
          with: {
            user: { columns: { id: true, username: true, avatar: true } },
          },
        },
        category: {
          columns: { id: true, name: true },
        },
        topics: {
          columns: {
            id: true,
            title: true,
            description: true,
            thumbnail: true,
            updatedAt: true,
            createdAt: true,
            status: true,
          },
          with: {
            author: {
              columns: { id: true, username: true, avatar: true },
            },
          },
        },
      },
      where: (fields, operators) => {
        return operators.eq(fields.id, id);
      },
    });
  } catch (error) {
    console.error(error);
    throw new Error('Erro ao buscar trilha');
  }
}

type UpdateTrail = Partial<
  Omit<NewTrail, 'id' | 'updatedAt' | 'createdAt' | 'authorId'>
>;

async function updateTrail(id: number, trail: UpdateTrail) {
  try {
    return db
      .update(trailTable)
      .set({ ...trail, updatedAt: new Date().toISOString() })
      .where(eq(trailTable.id, id))
      .returning()
      .get();
  } catch (error) {
    console.error(error);
    throw new Error('Erro ao atualizar trilha');
  }
}

export { createTrail, getTrailById, getTrails, updateTrail };
