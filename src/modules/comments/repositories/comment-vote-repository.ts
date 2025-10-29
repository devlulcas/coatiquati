import { db } from '@/modules/database/db';
import { comments, commentVotes } from '@/modules/database/schema/comment';
import { log } from '@/modules/logging/lib/pino';
import { and, eq } from 'drizzle-orm';

export class CommentVoteRepository {
  async getUserVote(commentId: number, userId: string): Promise<1 | -1 | 0> {
    const result = await db
      .select({ vote: commentVotes.value })
      .from(commentVotes)
      .where(
        and(
          eq(commentVotes.commentId, commentId),
          eq(commentVotes.userId, userId)
        )
      )
      .get();

    if (!result) return 0;

    return result.vote === 1 ? 1 : -1;
  }

  async upvote(commentId: number, userId: string): Promise<void> {
    this.voteComment(commentId, userId, 1);
  }

  async downvote(commentId: number, userId: string): Promise<void> {
    this.voteComment(commentId, userId, -1);
  }

  async removeVote(commentId: number, userId: string): Promise<void> {
    const result = await db
      .delete(commentVotes)
      .where(
        and(
          eq(commentVotes.commentId, commentId),
          eq(commentVotes.userId, userId)
        )
      )
      .execute();

    if (result.rowsAffected === 0) {
      throw new Error('Erro ao remover voto');
    }
  }

  private async voteComment(
    commentId: number,
    userId: string,
    vote: 1 | -1 | 0
  ): Promise<void> {
    await db.transaction(async (tx) => {
      try {
        await tx
          .insert(commentVotes)
          .values({ commentId, userId, value: vote })
          .returning({ id: commentVotes.id })
          .execute();

        const currentVoteCount = await tx
          .select({ count: comments.voteCount })
          .from(comments)
          .where(eq(comments.id, commentId))
          .get();

        await tx.update(comments).set({
          voteCount: currentVoteCount ? currentVoteCount.count + vote : 0,
        });
      } catch (error) {
        log.error(error);
        tx.rollback();
      }
    });
  }
}
