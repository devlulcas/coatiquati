'use server';

import { validateRequest } from '@/modules/auth/services/next';
import { isAuthenticated } from '@/modules/auth/utils/is';
import { db } from '@/modules/database/db';
import { commentVotes } from '@/modules/database/schema/comment';
import {
  isFail,
  ok,
  type Result,
  wrapAsyncInResult,
} from '@/shared/lib/result';
import { and, eq } from 'drizzle-orm';

export async function getuserCommentVoteQuery(
  commentId: number
): Promise<Result<number>> {
  const { data: user } = await validateRequest();

  if (!isAuthenticated(user)) {
    return ok(0);
  }

  const voteResult = await wrapAsyncInResult(
    db
      .select({ vote: commentVotes.value })
      .from(commentVotes)
      .where(
        and(
          eq(commentVotes.commentId, commentId),
          eq(commentVotes.userId, user.id)
        )
      )
      .get()
  );

  if (isFail(voteResult)) {
    return ok(0);
  }

  return ok(voteResult.value?.vote ?? 0);
}
