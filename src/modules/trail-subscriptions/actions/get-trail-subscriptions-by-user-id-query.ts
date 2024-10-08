'use server';

import { db } from '@/modules/database/db';
import { log } from '@/modules/logging/lib/pino';
import type { Trail } from '@/modules/trail/types/trail';
import type { UserId } from '@/modules/user/types/user';
import { fail, isFail, ok, wrapAsyncInResult, type Result } from '@/shared/lib/result';

export async function getTrailSubscriptionsByUserIdQuery(userId: UserId): Promise<Result<Trail[]>> {
  const subscriptions = await wrapAsyncInResult(
    db.query.trailSubscriptionTable.findMany({
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
    }),
  );

  if (isFail(subscriptions)) {
    log.error('Falha ao buscar inscrições de trilha.', subscriptions.fail);
    return fail('Falha ao buscar inscrições de trilha.');
  }

  return ok(subscriptions.value.flatMap(subscription => subscription.trail));
}
