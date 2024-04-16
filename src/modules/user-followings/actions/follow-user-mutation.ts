'use server';

import { getActionSession } from '@/modules/auth/utils/get-action-session';
import { isAuthenticated } from '@/modules/auth/utils/is';
import { db } from '@/modules/database/db';
import { userFollowerTable } from '@/modules/database/schema/user-follower';
import { log } from '@/modules/logging/lib/pino';
import { fail, ok, wrapAsyncInResult, type Result } from '@/shared/lib/result';
import { and, eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { currentUserIsFollowingQuery } from './current-user-is-following-query';

export async function followUserMutation(userId: string): Promise<Result<string>> {
  const session = await getActionSession();

  if (!isAuthenticated(session)) {
    return fail('Você precisa estar logado para seguir um usuário');
  }

  const currentUser = session.userId;
  const userToFollowResult = await wrapAsyncInResult(
    db.query.userTable.findFirst({
      where: (fields, operators) => {
        return operators.eq(fields.id, userId);
      },
    }),
  );

  if (userToFollowResult.type === 'fail' || !userToFollowResult.value) {
    return fail('Usuário não encontrado');
  }

  const isAlreadyFollowingResult = await currentUserIsFollowingQuery(userId, session);

  const follow = async () => {
    await db.insert(userFollowerTable).values({ userId, followerId: currentUser }).execute();
    log.info('Seguiu usuário', currentUser, userId);
  };

  const unfollow = async () => {
    await db
      .delete(userFollowerTable)
      .where(and(eq(userFollowerTable.userId, userId), eq(userFollowerTable.followerId, currentUser)))
      .execute();

    log.info('Deixou de seguir usuário', currentUser, userId);
  };

  try {
    if (isAlreadyFollowingResult.value) {
      await unfollow();
      return ok('Deixou de seguir usuário');
    }

    await follow();
    return ok('Seguiu usuário');
  } catch (error) {
    log.error('Erro ao seguir usuário', error);
    return fail('Erro ao seguir usuário');
  } finally {
    revalidatePath('/profile/' + userToFollowResult.value.username);
    revalidatePath('/profile/' + session.user.username);
  }
}
