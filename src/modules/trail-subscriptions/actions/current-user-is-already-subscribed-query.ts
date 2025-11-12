'use server';

import { db } from '@/modules/database/db';
import { trailSubscriptions } from '@/modules/database/schema/trail-subscription';
import { isFail, type Ok, ok, wrapAsyncInResult } from '@/shared/lib/result';
import { and, eq } from 'drizzle-orm';

export async function currentUserIsAlreadySubscribedQuery(
  trailId: number,
  userId: string
): Promise<Ok<boolean>> {
  if (!userId) return ok(false);

  const isAlreadyFollowing = await wrapAsyncInResult(
    db
      .select()
      .from(trailSubscriptions)
      .where(
        and(
          eq(trailSubscriptions.userId, userId),
          eq(trailSubscriptions.trailId, trailId)
        )
      )
      .then((result) => result.at(0) !== undefined)
  );

  if (isFail(isAlreadyFollowing)) {
    console.error(isAlreadyFollowing.fail);
    return ok(false);
  }

  return ok(isAlreadyFollowing.value);
}
