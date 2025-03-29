import { type DBTransaction } from '@/modules/database/db';
import {
  contentContributionTable,
  topicContributionTable,
  trailContributionTable,
} from '@/modules/database/schema/contribution';
import { log } from '@/modules/logging/lib/pino';
import type { UserId } from '@/modules/user/types/user';

type ContributionOptions = { trailId?: number; topicId?: number; contentId?: number };

export class ContributionRepository {
  async save(user: UserId, contributesTo: ContributionOptions, tx: DBTransaction): Promise<void> {
    try {
      log.info('Salvando contribuição', { user, contributesTo });

      if (contributesTo.trailId) {
        await tx
          .insert(trailContributionTable)
          .values({ userId: user, trailId: contributesTo.trailId })
          .onConflictDoNothing({ target: [trailContributionTable.userId, trailContributionTable.trailId] })
          .execute();
      }

      if (contributesTo.topicId) {
        await tx
          .insert(topicContributionTable)
          .values({ userId: user, topicId: contributesTo.topicId })
          .onConflictDoNothing({ target: [topicContributionTable.userId, topicContributionTable.topicId] })
          .execute();
      }

      if (contributesTo.contentId) {
        await tx
          .insert(contentContributionTable)
          .values({ userId: user, contentId: contributesTo.contentId })
          .onConflictDoNothing({ target: [contentContributionTable.userId, contentContributionTable.contentId] })
          .execute();
      }
    } catch (error) {
      log.error('Erro ao salvar contribuição' + String(error), { user, contributesTo });
      throw new Error('Erro ao salvar contribuição:' + (error instanceof Error ? error.message : String(error)));
    }
  }
}
