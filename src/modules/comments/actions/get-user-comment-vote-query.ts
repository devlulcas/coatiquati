'use server';

import { getCurrentUser } from '@/modules/auth/services/next';
import { db } from '@/modules/database/db';
import { ok, type Result } from '@/shared/lib/result';

export async function getUserCommentVoteQuery(
  commentId: number
): Promise<Result<number>> {
  const user = await getCurrentUser();

  if (!user) {
    return ok(0);
  }

  const vote = await db.query.votes.findFirst({
    where: (fields, operators) => {
      return operators.and(
        operators.eq(fields.commentId, commentId),
        operators.eq(fields.userId, user.id)
      );
    },
  });

  return ok(vote?.value ?? 0);
}
