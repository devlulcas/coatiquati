'use server';

import type { Session } from '@/modules/auth/types/session';
import { db } from '@/modules/database/db';
import { userFollowerTable } from '@/modules/database/schema/user-follower';
import { and, eq } from 'drizzle-orm';

export async function currentUserIsFollowingQuery(userId: string, session: Session): Promise<boolean> {
  if (!session) return false;

  const follower = session.userId;

  const isAlreadyFollowing = await db
    .select({ id: userFollowerTable.userId })
    .from(userFollowerTable)
    .where(and(eq(userFollowerTable.userId, userId), eq(userFollowerTable.followerId, follower)))
    .get();

  return Boolean(isAlreadyFollowing);
}
