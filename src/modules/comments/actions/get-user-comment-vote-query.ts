'use server';

import { validateRequest } from '@/modules/auth/services/lucia';
import { isAuthenticated } from '@/modules/auth/utils/is';
import { db } from '@/modules/database/db';
import { commentVoteTable } from '@/modules/database/schema/comment';
import { isFail, ok, wrapAsyncInResult, type Result } from '@/shared/lib/result';
import { and, eq } from 'drizzle-orm';

export async function getuserCommentVoteQuery(commentId: number): Promise<Result<number>> {
  const { user } = await validateRequest();

  if (!isAuthenticated(user)) {
    return ok(0);
  }

  const voteResult = await wrapAsyncInResult(
    db
      .select({ vote: commentVoteTable.value })
      .from(commentVoteTable)
      .where(and(eq(commentVoteTable.commentId, commentId), eq(commentVoteTable.userId, user.id)))
      .get(),
  );

  if (isFail(voteResult)) {
    return ok(0);
  }

  return ok(voteResult.value?.vote ?? 0);
}
