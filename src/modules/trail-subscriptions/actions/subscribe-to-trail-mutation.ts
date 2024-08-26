'use server';

import { validateRequest } from '@/modules/auth/services/lucia';
import { isAuthenticated } from '@/modules/auth/utils/is';
import { db } from '@/modules/database/db';
import { trailSubscriptionTable } from '@/modules/database/schema/trail-subscription';
import type { TrailId } from '@/modules/trail/types/trail';
import { fail, ok, type Result } from '@/shared/lib/result';
import { and, eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { currentUserIsAlreadySubscribedQuery } from './current-user-is-already-subscribed-query';

export async function subscribeToTrailMutation(trailId: TrailId): Promise<Result<string>> {
  const { user } = await validateRequest();

  if (!isAuthenticated(user?.role)) return fail('Usuário não autenticado');

  const isAlreadyFollowing = await currentUserIsAlreadySubscribedQuery(trailId, user.id);

  if (isAlreadyFollowing.value) {
    await db
      .delete(trailSubscriptionTable)
      .where(and(eq(trailSubscriptionTable.userId, user.id), eq(trailSubscriptionTable.trailId, trailId)))
      .execute();
  } else {
    await db.insert(trailSubscriptionTable).values({ trailId, userId: user.id }).execute();
  }

  revalidatePath('/profile/' + user.username);
  revalidatePath('/trails/' + trailId);
  revalidatePath('/dashboard/trails/' + trailId);

  return ok('Inscrição alterada com sucesso.');
}
