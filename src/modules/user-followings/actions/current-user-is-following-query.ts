'use server';

import { db } from '@/modules/database/db';
import { userFollowerTable } from '@/modules/database/schema/user-follower';
import { log } from '@/modules/logging/lib/pino';
import { ok, wrapAsyncInResult, type Ok } from '@/shared/lib/result';
import { and, eq } from 'drizzle-orm';

export async function currentUserIsFollowingQuery(userId: string, followerId?: string): Promise<Ok<boolean>> {
  if (!followerId) return ok(false);

  const isAlreadyFollowing = await wrapAsyncInResult(
    db
      .select({ id: userFollowerTable.userId })
      .from(userFollowerTable)
      .where(and(eq(userFollowerTable.userId, userId), eq(userFollowerTable.followerId, followerId)))
      .get(),
  );

  if (isAlreadyFollowing.type === 'fail') {
    log.error('Erro ao buscar se usuário já está seguindo', isAlreadyFollowing.fail);
  }

  return ok(isAlreadyFollowing.type === 'ok' && typeof isAlreadyFollowing.value !== 'undefined');
}
