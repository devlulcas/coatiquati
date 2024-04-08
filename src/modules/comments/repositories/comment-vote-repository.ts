import { db } from '@/modules/database/db';
import { commentVoteTable } from '@/modules/database/schema/comment';
import { and, eq } from 'drizzle-orm';

export class CommentVoteRepository {
  async getUserVote(commentId: number, userId: string): Promise<1 | -1 | 0> {
    const result = await db
      .select({ vote: commentVoteTable.vote })
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
    const result = await db
      .insert(commentVoteTable)
      .values({ commentId, userId, vote })
      .returning({ id: commentVoteTable.id })
      .execute();

    if (!result.length) {
      throw new Error('Erro ao votar no comentário');
    }
  }
}
