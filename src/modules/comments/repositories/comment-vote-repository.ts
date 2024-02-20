import { db } from '@/modules/database/db';
import { commentVoteTable } from '@/modules/database/schema/comment';
import { and, eq } from 'drizzle-orm';

export class CommentVoteRepository {
  getUserVote(commentId: number, userId: string, database = db): 1 | -1 | 0 | undefined {
    const result = database
      .select({ vote: commentVoteTable.vote })
      .from(commentVoteTable)
      .where(and(eq(commentVoteTable.commentId, commentId), eq(commentVoteTable.userId, userId)))
      .get();

    if (!result) {
      return undefined;
    }

    return result.vote === 1 ? 1 : -1;
  }

  async updateVote(commentId: number, userId: string, vote: 1 | -1 | 0, database = db): Promise<void> {
    await database
      .update(commentVoteTable)
      .set({ vote })
      .where(and(eq(commentVoteTable.commentId, commentId), eq(commentVoteTable.userId, userId)))
      .execute();
  }

  async voteComment(commentId: number, userId: string, vote: 1 | -1 | 0, database = db): Promise<void> {
    const result = await database
      .insert(commentVoteTable)
      .values({ commentId, userId, vote })
      .returning({ id: commentVoteTable.id })
      .execute();

    if (!result.length) {
      throw new Error('Erro ao votar no comentário');
    }
  }
}
