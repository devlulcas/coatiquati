'use server';

import { validateRequest } from '@/modules/auth/services/lucia';
import { isAuthenticated } from '@/modules/auth/utils/is';
import { db } from '@/modules/database/db';
import { userFollowerTable } from '@/modules/database/schema/user-follower';
import { log } from '@/modules/logging/lib/pino';
import { fail, ok, wrapAsyncInResult, type Result } from '@/shared/lib/result';
import { and, eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { currentUserIsFollowingQuery } from './current-user-is-following-query';

export async function followUserMutation(userId: string): Promise<Result<string>> {
  const { user } = await validateRequest();

  if (!isAuthenticated(user)) {
    return fail('Você precisa estar logado para seguir um usuário');
  }

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

  const isAlreadyFollowingResult = await currentUserIsFollowingQuery(userId, user.id);

  const follow = async () => {
    await db.insert(userFollowerTable).values({ userId, followerId: user.id }).execute();
    log.info('Seguiu usuário', user.id, userId);
  };

  const unfollow = async () => {
    await db
      .delete(userFollowerTable)
      .where(and(eq(userFollowerTable.userId, userId), eq(userFollowerTable.followerId, user.id)))
      .execute();

    log.info('Deixou de seguir usuário', user.id, userId);
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
    revalidatePath('/profile/' + user.username);
  }
}
