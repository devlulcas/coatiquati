'use server';

import { getCurrentUser } from '@/modules/auth/services/next';
import { db } from '@/modules/database/db';
import { VoteValue } from '@/modules/database/lib/vote-value-enum';
import { votes } from '@/modules/database/schema/vote';
import { fail, ok, type Result } from '@/shared/lib/result';
import { and, eq } from 'drizzle-orm';

export async function upvoteCommentMutation(commentId: number): Promise<Result<string>> {
  const user = await getCurrentUser();

  if (!user) {
    return fail('Somente usuários logados podem votar em comentários.');
  }

  try {
    await db
      .insert(votes)
      .values({
        userId: user.id,
        commentId,
        value: VoteValue.UPVOTE,
      })
      .onConflictDoNothing({
        target: [votes.commentId, votes.userId],
      });

    return ok('Voto computado.');
  } catch (error) {
    console.error(error);
    return fail('Erro ao votar em comentário.');
  }
}

export async function downvoteCommentMutation(commentId: number): Promise<Result<string>> {
  const user = await getCurrentUser();

  if (!user) {
    return fail('Somente usuários logados podem votar em comentários.');
  }

  try {
    await db
      .insert(votes)
      .values({
        userId: user.id,
        commentId,
        value: VoteValue.DOWNVOTE,
      })
      .onConflictDoNothing({
        target: [votes.commentId, votes.userId],
      });

    return ok('Voto computado.');
  } catch (error) {
    console.error(error);
    return fail('Erro ao votar em comentário.');
  }
}

export async function removeVoteCommentMutation(commentId: number): Promise<Result<string>> {
  const user = await getCurrentUser();

  if (!user) {
    return fail('Somente usuários logados podem votar em comentários.');
  }

  try {
    await db
      .update(votes)
      .set({ value: null })
      .where(and(eq(votes.commentId, commentId), eq(votes.userId, user.id)));

    return ok('Voto removido.');
  } catch (error) {
    console.error(error);
    return fail('Erro ao remover voto em comentário.');
  }
}
