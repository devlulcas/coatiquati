import { db } from '@/modules/database/db';
import {
  contentCommentTable,
  contentCommentVotingTable,
  type ContentNewCommentTable,
} from '@/modules/database/schema/comment';
import { CONTRIBUTOR_DB_FIELDS } from '@/modules/user/repositories/user-repository';
import { and, eq } from 'drizzle-orm';
import type { CommentWithAuthor } from '../types/comment';

export const COMMENT_DB_FIELDS = Object.freeze({
  id: true,
  createdAt: true,
  updatedAt: true,
  contentId: true,
  content: true,
  parentCommentId: true,
  upvotes: true,
  downvotes: true,
  edited: true,
  originalContent: true,
});

export class CommentRepository {
  async addCommentInContent(comment: ContentNewCommentTable, database = db): Promise<void> {
    const updatedAt = new Date().toISOString();

    const newComment = await database
      .insert(contentCommentTable)
      .values({ ...comment, updatedAt })
      .returning({ id: contentCommentTable.id })
      .execute();

    if (!newComment.length) {
      throw new Error('Erro ao adicionar comentário');
    }
  }

  async getCommentsByContentId(contentId: number, userId?: string, database = db): Promise<CommentWithAuthor[]> {
    const comments = await database.query.contentCommentTable.findMany({
      columns: COMMENT_DB_FIELDS,
      where(fields, operators) {
        return operators.and(
          operators.eq(fields.contentId, contentId),
          operators.isNull(fields.parentCommentId),
          operators.isNull(fields.deletedAt),
        );
      },
      with: {
        author: {
          columns: CONTRIBUTOR_DB_FIELDS,
        },
        votes: userId
          ? {
              columns: {
                vote: true,
              },
              where: (fields, operators) => {
                return operators.eq(fields.userId, userId);
              },
            }
          : undefined,
      },
    });

    if (!comments.length) {
      throw new Error('Erro ao buscar comentários');
    }

    return comments.map(comment => ({
      id: comment.id,
      createdAt: comment.createdAt,
      updatedAt: comment.updatedAt,
      contentId: comment.contentId,
      content: comment.content,
      parentCommentId: comment.parentCommentId,
      upvotes: comment.upvotes,
      author: {
        id: comment.author.id,
        username: comment.author.username,
        avatar: comment.author.avatar,
      },
      downvotes: comment.downvotes,
      edited: comment.edited,
      originalContent: comment.originalContent,
      currentUserVote: comment.votes?.at(0)?.vote,
    }));
  }

  async getCommentResponsesByCommentId(
    commentId: number,
    userId?: string,
    database = db,
  ): Promise<CommentWithAuthor[]> {
    const comments = await database.query.contentCommentTable.findMany({
      columns: COMMENT_DB_FIELDS,
      where(fields, operators) {
        return operators.and(operators.eq(fields.parentCommentId, commentId), operators.isNull(fields.deletedAt));
      },
      with: {
        author: {
          columns: CONTRIBUTOR_DB_FIELDS,
        },
        votes: userId
          ? {
              columns: {
                vote: true,
              },
              where: (fields, operators) => {
                return operators.eq(fields.userId, userId);
              },
            }
          : undefined,
      },
    });

    if (!comments.length) {
      throw new Error('Erro ao buscar comentários');
    }

    return comments.map(comment => ({
      id: comment.id,
      createdAt: comment.createdAt,
      updatedAt: comment.updatedAt,
      contentId: comment.contentId,
      content: comment.content,
      parentCommentId: comment.parentCommentId,
      upvotes: comment.upvotes,
      author: {
        id: comment.author.id,
        username: comment.author.username,
        avatar: comment.author.avatar,
      },
      downvotes: comment.downvotes,
      edited: comment.edited,
      originalContent: comment.originalContent,
      currentUserVote: comment.votes?.at(0)?.vote,
    }));
  }

  async upvoteComment(userId: string, commentId: number, database = db): Promise<void> {
    return this.voteComment(userId, commentId, 1, database);
  }

  async downvoteComment(userId: string, commentId: number, database = db): Promise<void> {
    return this.voteComment(userId, commentId, -1, database);
  }

  private async voteComment(userId: string, commentId: number, vote: 1 | -1, database = db): Promise<void> {
    const updatedAt = new Date().toISOString();

    const comment = database
      .select({ upvotes: contentCommentTable.upvotes, downvotes: contentCommentTable.downvotes })
      .from(contentCommentTable)
      .where(eq(contentCommentTable.id, commentId))
      .get();

    if (!comment) {
      throw new Error('Erro ao votar no comentário. Comentário não encontrado');
    }

    const voting = database
      .select({ vote: contentCommentVotingTable.vote })
      .from(contentCommentVotingTable)
      .where(and(eq(contentCommentVotingTable.userId, userId), eq(contentCommentVotingTable.commentId, commentId)))
      .get();

    // Vote = 1 (upvote), -1 (downvote), 0 (remove vote)
    const voteValue = voting ? voting.vote : 0;
    const hasVoted = Boolean(voting);
    const firstKey = vote === 1 ? 'upvotes' : 'downvotes';
    const secondKey = vote === 1 ? 'downvotes' : 'upvotes';

    await database.transaction(async tx => {
      try {
        // Vote (click on upvote or downvote)
        if (!hasVoted) {
          await database
            .update(contentCommentTable)
            .set({ [firstKey]: comment[firstKey] + 1, updatedAt })
            .where(eq(contentCommentTable.id, commentId))
            .execute();

          await database
            .insert(contentCommentVotingTable)
            .values({ userId, commentId, vote, updatedAt })
            .returning({ id: contentCommentVotingTable.id })
            .execute();
        }

        // Undo current vote (click on upvote or downvote)
        else if (hasVoted && voteValue === vote) {
          await database
            .update(contentCommentTable)
            .set({ [firstKey]: comment[firstKey] - 1, updatedAt })
            .where(eq(contentCommentTable.id, commentId))
            .execute();

          await database
            .update(contentCommentVotingTable)
            .set({ vote: 0, updatedAt })
            .where(
              and(eq(contentCommentVotingTable.userId, userId), eq(contentCommentVotingTable.commentId, commentId)),
            )
            .execute();
        }

        // Change vote (click on upvote or downvote)
        else if (hasVoted && voteValue !== vote) {
          await database
            .update(contentCommentTable)
            .set({ [firstKey]: comment[firstKey] + 1, [secondKey]: comment[secondKey] - 1, updatedAt })
            .where(eq(contentCommentTable.id, commentId))
            .execute();

          await database
            .update(contentCommentVotingTable)
            .set({ vote, updatedAt })
            .where(
              and(eq(contentCommentVotingTable.userId, userId), eq(contentCommentVotingTable.commentId, commentId)),
            )
            .execute();
        }
      } catch (error) {
        tx.rollback();
        throw error;
      }
    });
  }
}
