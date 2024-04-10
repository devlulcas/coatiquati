'use server';

import type { Session } from '@/modules/auth/types/session';
import { db } from '@/modules/database/db';
import { userFollowerTable } from '@/modules/database/schema/user-follower';
import { log } from '@/modules/logging/lib/pino';
import { asyncResult, ok, type Ok } from '@/shared/lib/result';
import { and, eq } from 'drizzle-orm';

export async function currentUserIsFollowingQuery(userId: string, session: Session): Promise<Ok<boolean>> {
  if (!session) return ok(false);

  const follower = session.userId;

  const isAlreadyFollowing = await asyncResult(
    db
      .select({ id: userFollowerTable.userId })
      .from(userFollowerTable)
      .where(and(eq(userFollowerTable.userId, userId), eq(userFollowerTable.followerId, follower)))
      .get(),
  );

  if (isAlreadyFollowing.type === 'fail') {
    log.error('Erro ao buscar se usuário já está seguindo', isAlreadyFollowing.fail);
  }

  return ok(isAlreadyFollowing.type === 'ok' && typeof isAlreadyFollowing.value !== 'undefined');
}
