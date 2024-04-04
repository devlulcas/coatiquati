'use server';

import { db } from '@/modules/database/db';
import type { Trail } from '@/modules/trail/types/trail';
import type { UserId } from '@/modules/user/types/user';

export async function getTrailSubscriptionsByUserIdQuery(userId: UserId): Promise<Trail[]> {
  const subscriptions = await db.query.trailSubscriptionTable.findMany({
    columns: {
      trailId: false,
      userId: false,
    },
    where: (fields, operators) => {
      return operators.eq(fields.userId, userId);
    },
    with: {
      trail: {
        with: {
          author: true,
          contributors: { with: { user: true } },
          category: true,
        },
      },
    },
  });

  return subscriptions.flatMap(subscription => subscription.trail);
}
