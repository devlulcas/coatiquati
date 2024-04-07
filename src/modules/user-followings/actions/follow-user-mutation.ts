'use server';

import { getActionSession } from '@/modules/auth/utils/get-action-session';
import { isAuthenticated } from '@/modules/auth/utils/is';
import { db } from '@/modules/database/db';
import { userFollowerTable } from '@/modules/database/schema/user-follower';
import { log } from '@/modules/logging/lib/pino';
import { and, eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { currentUserIsFollowingQuery } from './current-user-is-following-query';

export async function followUserMutation(userId: string) {
  const session = await getActionSession();

  if (!isAuthenticated(session)) {
    throw new Error('Você precisa estar logado para seguir um usuário');
  }

  const currentUser = session.userId;
  const userToFollow = await db.query.userTable.findFirst({
    where: (fields, operators) => {
      return operators.eq(fields.id, userId);
    },
  });

  const isAlreadyFollowing = await currentUserIsFollowingQuery(userId, session);

  if (Boolean(isAlreadyFollowing)) {
    await db
      .delete(userFollowerTable)
      .where(and(eq(userFollowerTable.userId, userId), eq(userFollowerTable.followerId, currentUser)))
      .execute();

    log.info('Deixou de seguir usuário', currentUser, userId);
  } else {
    await db.insert(userFollowerTable).values({ userId, followerId: currentUser }).execute();
    log.info('Seguiu usuário', currentUser, userId);
  }

  revalidatePath('/profile/' + userToFollow?.username);
  revalidatePath('/profile/' + session.user.username);
}
