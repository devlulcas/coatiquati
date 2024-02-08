import { db } from '@/modules/database/db';
import { contentCommentVotingTable } from '@/modules/database/schema/comment';
import { and, eq } from 'drizzle-orm';

export class CommentVoteRepository {
  getUserVote(commentId: number, userId: string, database = db): 1 | -1 | 0 | undefined {
    const result = database
      .select({ vote: contentCommentVotingTable.vote })
      .from(contentCommentVotingTable)
      .where(and(eq(contentCommentVotingTable.commentId, commentId), eq(contentCommentVotingTable.userId, userId)))
      .get();

    if (!result) {
      return undefined;
    }

    return result.vote === 1 ? 1 : -1;
  }

  async updateVote(commentId: number, userId: string, vote: 1 | -1 | 0, database = db): Promise<void> {
    await database
      .update(contentCommentVotingTable)
      .set({ vote })
      .where(and(eq(contentCommentVotingTable.commentId, commentId), eq(contentCommentVotingTable.userId, userId)))
      .execute();
  }

  async voteComment(commentId: number, userId: string, vote: 1 | -1 | 0, database = db): Promise<void> {
    const result = await database
      .insert(contentCommentVotingTable)
      .values({ commentId, userId, vote })
      .returning({ id: contentCommentVotingTable.id })
      .execute();

    if (!result.length) {
      throw new Error('Erro ao votar no comentário');
    }
  }
}
