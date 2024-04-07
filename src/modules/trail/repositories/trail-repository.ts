import { ContributionRepository } from '@/modules/contributions/repositories/contribution-repository';
import { db } from '@/modules/database/db';
import { categoryTable, trailTable } from '@/modules/database/schema/trail';
import { log } from '@/modules/logging/lib/pino';
import { contentStatus } from '@/shared/constants/content-status';
import { asc, eq, type SQL } from 'drizzle-orm';
import type { TrailSearchSchema } from '../actions/get-trails-query';
import type { NewTrail, Trail, TrailWithTopicArray, UpdateTrail } from '../types/trail';

export class TrailRepository {
  constructor(private readonly contributionRepository: ContributionRepository = new ContributionRepository()) {}

  async createTrail(trail: NewTrail): Promise<number> {
    return db.transaction(async tx => {
      try {
        if (trail.category) {
          await tx
            .insert(categoryTable)
            .values({ name: trail.category, authorId: trail.authorId })
            .onConflictDoNothing()
            .execute();

          log.info('Categoria inserida', { category: trail.category });
        }

        const newTrail = await tx.insert(trailTable).values(trail).returning({ id: trailTable.id }).get();
        log.info('Trilha inserida', newTrail);

        return newTrail.id;
      } catch (error) {
        log.error('Erro ao criar trilha', String(error), trail);
        tx.rollback();
        throw new Error('Erro ao criar trilha');
      }
    });
  }

  async getTrailById(id: number, database = db): Promise<TrailWithTopicArray> {
    const data: TrailWithTopicArray | undefined = await database.query.trailTable.findFirst({
      with: {
        contributors: { with: { user: true } },
        category: true,
        author: true,
        topics: {
          with: {
            author: true,
            contributors: {
              with: {
                user: true,
              },
            },
          },
        },
      },
    });

    if (!data) {
      log.error('Trilha não encontrada', { id });
      throw new Error('Trilha não encontrada');
    }

    return data;
  }

  async getTrails(params: TrailSearchSchema, includeDraft = false): Promise<Trail[]> {
    try {
      return db.query.trailTable.findMany({
        limit: params.take,
        offset: params.skip,
        where: (fields, operators) => {
          const filters: SQL[] = [];

          for (const [field, value] of Object.entries(params)) {
            if (field === 'status' && value === contentStatus.DRAFT && !includeDraft) {
              continue;
            }

            if (value && Object.hasOwn(fields, field)) {
              const databaseField = fields[field as keyof typeof fields];

              if (Object.hasOwn(databaseField, 'columnType')) {
                filters.push(operators.eq(databaseField, value));
              }
            }
          }

          if (!includeDraft) {
            filters.push(operators.eq(fields.status, contentStatus.PUBLISHED));
          }

          return operators.and(...filters);
        },
        with: {
          contributors: { with: { user: true } },
          category: true,
          author: true,
        },
      });
    } catch (error) {
      log.error('Erro ao buscar trilhas', { error, params });
      throw new Error('Erro ao buscar trilhas');
    }
  }

  async getRecentTrails(): Promise<Trail[]> {
    return db.query.trailTable.findMany({
      limit: 15,
      where: (fields, operators) => operators.eq(fields.status, contentStatus.PUBLISHED),
      orderBy: asc(trailTable.createdAt),
      with: {
        contributors: { with: { user: true } },
        category: true,
        author: true,
      },
    });
  }

  async updateTrail(trail: UpdateTrail): Promise<void> {
    const currentTrail = await db
      .select({ authorId: trailTable.authorId })
      .from(trailTable)
      .where(eq(trailTable.id, trail.id))
      .get();

    if (!currentTrail) {
      log.error('Trilha não encontrada', { trail });
      throw new Error('Trilha não encontrada');
    }

    return db.transaction(async tx => {
      try {
        if (trail.category) {
          await tx
            .insert(categoryTable)
            .values({ name: trail.category, authorId: currentTrail.authorId })
            .onConflictDoNothing()
            .execute();
        }

        await tx.update(trailTable).set(trail).where(eq(trailTable.id, trail.id)).execute();

        if (trail.contributorId !== currentTrail.authorId) {
          await this.contributionRepository.save(trail.contributorId, { trailId: trail.id }, tx);
        }
      } catch (error) {
        log.error('Erro ao atualizar trilha', { error, trail });
        tx.rollback();
        throw new Error('Erro ao atualizar trilha');
      }
    });
  }

  async omitTrail(id: number): Promise<void> {
    try {
      await db.update(trailTable).set({ status: contentStatus.DRAFT }).where(eq(trailTable.id, id)).execute();
    } catch (error) {
      console.clear();
      log.error('Erro ao omitir trilha ' + (error instanceof Error ? error.message : ''), { error, id });
      throw new Error('Erro ao omitir trilha');
    }
  }

  async enableTrail(id: number): Promise<void> {
    try {
      await db.update(trailTable).set({ status: contentStatus.PUBLISHED }).where(eq(trailTable.id, id)).execute();
    } catch (error) {
      console.clear();
      log.error('Erro ao habilitar trilha ' + (error instanceof Error ? error.message : ''), { error, id });
      throw new Error('Erro ao habilitar trilha');
    }
  }
}
