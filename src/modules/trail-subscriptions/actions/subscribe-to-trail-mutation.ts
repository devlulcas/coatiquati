'use server';

import { getActionSession } from '@/modules/auth/utils/get-action-session';
import { isAuthenticated } from '@/modules/auth/utils/is';
import { db } from '@/modules/database/db';
import { trailSubscriptionTable } from '@/modules/database/schema/trail-subscription';
import type { TrailId } from '@/modules/trail/types/trail';
import { fail, ok, type Result } from '@/shared/lib/result';
import { and, eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { currentUserIsAlreadySubscribedQuery } from './current-user-is-already-subscribed-query';

export async function subscribeToTrailMutation(trailId: TrailId): Promise<Result<string>> {
  const session = await getActionSession();

  if (!isAuthenticated(session)) return fail('Usuário não autenticado');

  const currentUser = session.userId;

  const isAlreadyFollowing = await currentUserIsAlreadySubscribedQuery(trailId, currentUser);

  if (isAlreadyFollowing.value) {
    await db
      .delete(trailSubscriptionTable)
      .where(and(eq(trailSubscriptionTable.userId, currentUser), eq(trailSubscriptionTable.trailId, trailId)))
      .execute();
  } else {
    await db.insert(trailSubscriptionTable).values({ trailId, userId: currentUser }).execute();
  }

  revalidatePath('/profile/' + session.user.username);
  revalidatePath('/trails/' + trailId);
  revalidatePath('/dashboard/trails/' + trailId);

  return ok('Inscrição alterada com sucesso.');
}
