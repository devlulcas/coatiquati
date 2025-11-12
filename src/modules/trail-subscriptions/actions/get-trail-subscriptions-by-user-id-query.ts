'use server';

import { db } from '@/modules/database/db';
import type { Trail } from '@/modules/trail/types/trail';
import {
  fail,
  isFail,
  ok,
  type Result,
  wrapAsyncInResult,
} from '@/shared/lib/result';

export async function getTrailSubscriptionsByUserIdQuery(
  userId: string
): Promise<Result<Trail[]>> {
  const subscriptions = await wrapAsyncInResult(
    db.query.trailSubscriptions.findMany({
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
            contributions: { with: { user: true } },
            category: true,
          },
        },
      },
    })
  );

  if (isFail(subscriptions)) {
    console.error(subscriptions.fail);
    return fail('Falha ao buscar inscrições de trilha.');
  }

  const trails: Trail[] = subscriptions.value.flatMap((subscription) => ({
    ...subscription.trail,
    contributors: subscription.trail.contributions.map(
      (contribution) => contribution.user
    ),
  }));

  return ok(trails);
}
