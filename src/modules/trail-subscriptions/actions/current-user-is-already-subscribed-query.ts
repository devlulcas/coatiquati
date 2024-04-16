'use server';

import { db } from '@/modules/database/db';
import { trailSubscriptionTable } from '@/modules/database/schema/trail-subscription';
import { log } from '@/modules/logging/lib/pino';
import { ok, wrapAsyncInResult, type Ok } from '@/shared/lib/result';
import { and, eq } from 'drizzle-orm';

export async function currentUserIsAlreadySubscribedQuery(trailId: number, userId: string): Promise<Ok<boolean>> {
  if (!userId) return ok(false);

  const isAlreadyFollowing = await wrapAsyncInResult(
    db
      .select()
      .from(trailSubscriptionTable)
      .where(and(eq(trailSubscriptionTable.userId, userId), eq(trailSubscriptionTable.trailId, trailId)))
      .get(),
  );

  if (isAlreadyFollowing.type === 'fail') {
    log.error('Falha ao buscar inscrição de trilha.', isAlreadyFollowing.fail);
    return ok(false);
  }

  return ok(Boolean(isAlreadyFollowing.value));
}
