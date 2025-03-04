import { db } from '@/modules/database/db';
import { commentTable, commentVoteTable } from '@/modules/database/schema/comment';
import { log } from '@/modules/logging/lib/pino';
import { and, eq } from 'drizzle-orm';

export class CommentVoteRepository {
  async getUserVote(commentId: number, userId: string): Promise<1 | -1 | 0> {
    const result = await db
      .select({ vote: commentVoteTable.value })
      .from(commentVoteTable)
      .where(and(eq(commentVoteTable.commentId, commentId), eq(commentVoteTable.userId, userId)))
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
      .delete(commentVoteTable)
      .where(and(eq(commentVoteTable.commentId, commentId), eq(commentVoteTable.userId, userId)))
      .execute();

    if (result.rowsAffected === 0) {
      throw new Error('Erro ao remover voto');
    }
  }

  private async voteComment(commentId: number, userId: string, vote: 1 | -1 | 0): Promise<void> {
    await db.transaction(async tx => {
      try {
        await tx
          .insert(commentVoteTable)
          .values({ commentId, userId, value: vote })
          .returning({ id: commentVoteTable.id })
          .execute();

        const currentVoteCount = await tx
          .select({ count: commentTable.voteCount })
          .from(commentTable)
          .where(eq(commentTable.id, commentId))
          .get();

        await tx.update(commentTable).set({
          voteCount: currentVoteCount ? currentVoteCount.count + vote : 0,
        });
      } catch (error) {
        log.error(error);
        tx.rollback();
      }
    });
  }
}
