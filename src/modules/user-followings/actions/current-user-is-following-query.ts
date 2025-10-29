'use server';

import { db } from '@/modules/database/db';
import { userFollowers } from '@/modules/database/schema/user-follower';
import { log } from '@/modules/logging/lib/pino';
import { isFail, type Ok, ok, wrapAsyncInResult } from '@/shared/lib/result';
import { and, eq } from 'drizzle-orm';

export async function currentUserIsFollowingQuery(
  userId: string,
  followerId?: string
): Promise<Ok<boolean>> {
  if (!followerId) return ok(false);

  const isAlreadyFollowing = await wrapAsyncInResult(
    db
      .select({ id: userFollowers.userId })
      .from(userFollowers)
      .where(
        and(
          eq(userFollowers.userId, userId),
          eq(userFollowers.followerId, followerId)
        )
      )
      .get()
  );

  if (isFail(isAlreadyFollowing)) {
    log.error(
      'Erro ao buscar se usuário já está seguindo',
      isAlreadyFollowing.fail
    );
  }

  return ok(
    isAlreadyFollowing.type === 'ok' &&
      typeof isAlreadyFollowing.value !== 'undefined'
  );
}
