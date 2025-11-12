'use server';

import {
  assertAuthenticated,
  getCurrentUser,
} from '@/modules/auth/services/next';
import { db } from '@/modules/database/db';
import { trailSubscriptions } from '@/modules/database/schema/trail-subscription';
import { ok, type Result } from '@/shared/lib/result';
import { and, eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { currentUserIsAlreadySubscribedQuery } from './current-user-is-already-subscribed-query';

export async function subscribeToTrailMutation(
  trailId: number
): Promise<Result<string>> {
  const user = await getCurrentUser();
  assertAuthenticated(user);

  const isAlreadyFollowing = await currentUserIsAlreadySubscribedQuery(
    trailId,
    user.id
  );

  if (isAlreadyFollowing.value) {
    await db
      .delete(trailSubscriptions)
      .where(
        and(
          eq(trailSubscriptions.userId, user.id),
          eq(trailSubscriptions.trailId, trailId)
        )
      )
      .execute();
  } else {
    await db
      .insert(trailSubscriptions)
      .values({ trailId, userId: user.id })
      .execute();
  }

  revalidatePath(`/profile/${user.username}`);
  revalidatePath(`/trails/${trailId}`);
  revalidatePath(`/dashboard/trails/${trailId}`);

  return ok('Inscrição alterada com sucesso.');
}
