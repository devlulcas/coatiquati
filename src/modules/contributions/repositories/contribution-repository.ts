import { db } from '@/modules/database/db';
import { contentTable } from '@/modules/database/schema/content';
import {
  contentContributionTable,
  topicContributionTable,
  trailContributionTable,
} from '@/modules/database/schema/contribution';
import { topicTable } from '@/modules/database/schema/topic';
import { log } from '@/modules/logging/lib/pino';
import { eq } from 'drizzle-orm';

export class ContributionRepository {
  /**
   * Contribuir com uma trilha.
   */
  async contributeInTrail(trailId: number, userId: string, database = db): Promise<void> {
    await database.transaction(async tx => {
      try {
        const contributedAt = new Date().toISOString();
        await tx.insert(trailContributionTable).values({ trailId, userId, contributedAt }).execute();
      } catch (error) {
        log.error('Erro ao registrar contribuição em trilha.', { trailId, userId, error });
        tx.rollback();
        throw new Error('Erro ao registrar contribuição em trilha.');
      }
    });
  }

  /**
   * Contribuir com um tópico também conta como contribuição para uma trilha.
   */
  async contributeInTopic(topicId: number, userId: string, database = db): Promise<void> {
    await database.transaction(async tx => {
      try {
        const contributedAt = new Date().toISOString();
        await tx.insert(topicContributionTable).values({ topicId, userId, contributedAt }).execute();

        const trailResult = tx
          .select({ trailId: topicTable.trailId })
          .from(topicTable)
          .where(eq(topicTable.id, topicId))
          .get();

        if (!trailResult || !trailResult.trailId) {
          log.error('Erro ao contribuir com tópico. Trilha não encontrada.', { topicId, userId });
          throw new Error('Erro ao contribuir com tópico. Trilha não encontrada.');
        }

        await tx
          .insert(trailContributionTable)
          .values({ trailId: trailResult.trailId, userId, contributedAt })
          .execute();
      } catch (error) {
        log.error('Erro ao registrar contribuição em tópico.', { topicId, userId, error });
        tx.rollback();
        throw new Error('Erro ao registrar contribuição em tópico.');
      }
    });
  }

  /**
   * Contribuir em um conteúdo também conta como contribuição para um tópico e trilha.
   */
  async contributeInContent(contentId: number, userId: string, database = db): Promise<void> {
    await database.transaction(async tx => {
      try {
        const contributedAt = new Date().toISOString();
        await tx.insert(contentContributionTable).values({ contentId, userId, contributedAt }).execute();

        const topicResult = tx
          .select({ topicId: contentTable.topicId })
          .from(contentTable)
          .where(eq(contentTable.id, contentId))
          .get();

        if (!topicResult || !topicResult.topicId) {
          log.error('Erro ao contribuir com conteúdo. Tópico não encontrado.', { contentId, userId });
          throw new Error('Erro ao contribuir com conteúdo. Tópico não encontrado.');
        }

        await tx
          .insert(topicContributionTable)
          .values({ topicId: topicResult.topicId, userId, contributedAt })
          .execute();

        const trailResult = tx
          .select({ trailId: topicTable.trailId })
          .from(topicTable)
          .where(eq(topicTable.id, topicResult.topicId))
          .get();

        if (!trailResult || !trailResult.trailId) {
          log.error('Erro ao contribuir com conteúdo. Trilha não encontrada.', { contentId, userId });
          throw new Error('Erro ao contribuir com conteúdo. Trilha não encontrada.');
        }

        await tx
          .insert(trailContributionTable)
          .values({ trailId: trailResult.trailId, userId, contributedAt })
          .execute();
      } catch (error) {
        tx.rollback();
        throw new Error('Erro ao contribuir com conteúdo');
      }
    });
  }
}
