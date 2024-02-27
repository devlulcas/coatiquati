'use server';

import { db } from '@/modules/database/db';
import { CATEGORY_DB_FIELDS, TRAIL_DB_FIELDS } from '@/modules/trail/repositories/trail-repository';
import type { Trail } from '@/modules/trail/types/trail';
import { CONTRIBUTOR_DB_FIELDS } from '@/modules/user/repositories/user-repository';
import type { UserId } from '@/modules/user/types/user';

export async function getTrailSubscriptionsByUserIdQuery(userId: UserId): Promise<Trail[]> {
  const subscriptions = await db.query.trailSubscriptionTable.findMany({
    where: (fields, operators) => {
      return operators.eq(fields.userId, userId);
    },
    with: {
      trail: {
        columns: TRAIL_DB_FIELDS,
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
      },
    },
  });

  return subscriptions.map(subscription => subscription.trail);
}
