'use server';

import {
  assertAuthenticated,
  getCurrentUser,
} from '@/modules/auth/services/next';
import { db } from '@/modules/database/db';
import { userFollowers } from '@/modules/database/schema/user-follower';
import {
  fail,
  isFail,
  ok,
  type Result,
  wrapAsyncInResult,
} from '@/shared/lib/result';
import { and, eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { currentUserIsFollowingQuery } from './current-user-is-following-query';

export async function followUserMutation(
  userId: string
): Promise<Result<string>> {
  const user = await getCurrentUser();
  assertAuthenticated(user);

  const userToFollowResult = await wrapAsyncInResult(
    db.query.user.findFirst({
      where: (fields, operators) => {
        return operators.eq(fields.id, userId);
      },
    })
  );

  if (isFail(userToFollowResult) || !userToFollowResult.value) {
    return fail('Usuário não encontrado');
  }

  const isAlreadyFollowingResult = await currentUserIsFollowingQuery(
    userId,
    user.id
  );

  const follow = async () => {
    await db
      .insert(userFollowers)
      .values({ userId, followerId: user.id })
      .execute();
  };

  const unfollow = async () => {
    await db
      .delete(userFollowers)
      .where(
        and(
          eq(userFollowers.userId, userId),
          eq(userFollowers.followerId, user.id)
        )
      )
      .execute();
  };

  try {
    if (isAlreadyFollowingResult.value) {
      await unfollow();
      return ok('Deixou de seguir usuário');
    }

    await follow();
    return ok('Seguiu usuário');
  } catch (error) {
    console.error(error);
    return fail('Erro ao seguir usuário');
  } finally {
    revalidatePath(`/profile/${userToFollowResult.value.username}`);
    revalidatePath(`/profile/${user.username}`);
  }
}
