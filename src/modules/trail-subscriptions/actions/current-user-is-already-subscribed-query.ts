'use server';

import { db } from '@/modules/database/db';
import { trailSubscriptionTable } from '@/modules/database/schema/trail-subscription';
import { and, eq } from 'drizzle-orm';

export async function currentUserIsAlreadySubscribedQuery(trailId: number, userId: string): Promise<boolean> {
  if (!userId) return false;

  const isAlreadyFollowing = await db
    .select()
    .from(trailSubscriptionTable)
    .where(and(eq(trailSubscriptionTable.userId, userId), eq(trailSubscriptionTable.trailId, trailId)))
    .get();

  return Boolean(isAlreadyFollowing);
}
