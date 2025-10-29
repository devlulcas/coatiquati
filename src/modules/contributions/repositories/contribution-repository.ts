import type { DBTransaction } from '@/modules/database/db';
import {
  contentContributions,
  topicContributions,
  trailContributions,
} from '@/modules/database/schema/contribution';
import type { UserId } from '@/modules/user/types/user';

type ContributionOptions = {
  trailId?: number;
  topicId?: number;
  contentId?: number;
};

export class ContributionRepository {
  async save(
    user: UserId,
    contributesTo: ContributionOptions,
    tx: DBTransaction
  ): Promise<void> {
    if (contributesTo.trailId) {
      await tx
        .insert(trailContributions)
        .values({ userId: user, trailId: contributesTo.trailId })
        .onConflictDoNothing({
          target: [trailContributions.userId, trailContributions.trailId],
        })
        .execute();
    }

    if (contributesTo.topicId) {
      await tx
        .insert(topicContributions)
        .values({ userId: user, topicId: contributesTo.topicId })
        .onConflictDoNothing({
          target: [topicContributions.userId, topicContributions.topicId],
        })
        .execute();
    }

    if (contributesTo.contentId) {
      await tx
        .insert(contentContributions)
        .values({ userId: user, contentId: contributesTo.contentId })
        .onConflictDoNothing({
          target: [contentContributions.userId, contentContributions.contentId],
        })
        .execute();
    }
  }
}
