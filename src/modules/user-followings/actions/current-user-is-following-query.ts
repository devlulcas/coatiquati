'use server';

import { db } from '@/modules/database/db';
import { userFollowers } from '@/modules/database/schema/user-follower';
import { type Ok, ok } from '@/shared/lib/result';
import { and, eq } from 'drizzle-orm';

export async function currentUserIsFollowingQuery(
  userId: string,
  target?: string
): Promise<Ok<boolean>> {
  if (!target) return ok(false);

  const isAlreadyFollowing = await db
    .select({ id: userFollowers.userId })
    .from(userFollowers)
    .where(
      and(
        eq(userFollowers.userId, userId),
        eq(userFollowers.followerId, target)
      )
    )
    .then((result) => result.at(0) !== undefined);

  return ok(isAlreadyFollowing);
}
