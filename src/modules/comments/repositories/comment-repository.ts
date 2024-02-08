import { db } from '@/modules/database/db';
import {
  contentCommentTable,
  contentCommentVotingTable,
  type ContentNewCommentTable,
} from '@/modules/database/schema/comment';
import { userTable } from '@/modules/database/schema/user';
import { and, asc, eq, isNull, sql } from 'drizzle-orm';
import type { CommentWithAuthor, CommentWithAuthorSelect } from '../types/comment';

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

  getCommentsByContentId(contentId: number, database = db): CommentWithAuthor[] {
    const comments = database
      .select({
        id: contentCommentTable.id,
        createdAt: contentCommentTable.createdAt,
        updatedAt: contentCommentTable.updatedAt,
        contentId: contentCommentTable.contentId,
        content: contentCommentTable.content,
        parentCommentId: contentCommentTable.parentCommentId,
        upvotes: sql<number>`CAST(COUNT(CASE WHEN ${contentCommentVotingTable.vote} = 1 THEN 1 ELSE NULL END) as int)`,
        downvotes: sql<number>`CAST(COUNT(CASE WHEN ${contentCommentVotingTable.vote} = -1 THEN 1 ELSE NULL END) as int)`,
        author: {
          id: userTable.id,
          username: userTable.username,
          avatar: userTable.avatar,
        },
      })
      .from(contentCommentTable)
      .where(
        and(
          eq(contentCommentTable.contentId, contentId),
          isNull(contentCommentTable.parentCommentId),
          isNull(contentCommentTable.deletedAt),
        ),
      )
      .leftJoin(userTable, eq(userTable.id, contentCommentTable.authorId))
      .leftJoin(contentCommentVotingTable, eq(contentCommentVotingTable.commentId, contentCommentTable.id))
      .groupBy(contentCommentTable.id)
      .orderBy(contentCommentTable.createdAt, asc(contentCommentTable.createdAt))
      .all();

    return comments.map(comment => this.toCommentWithAuthor(comment));
  }

  getCommentResponsesByCommentId(commentId: number, database = db): CommentWithAuthor[] {
    const comments = database
      .select({
        id: contentCommentTable.id,
        createdAt: contentCommentTable.createdAt,
        updatedAt: contentCommentTable.updatedAt,
        contentId: contentCommentTable.contentId,
        content: contentCommentTable.content,
        parentCommentId: contentCommentTable.parentCommentId,
        upvotes: sql<number>`CAST(COUNT(CASE WHEN ${contentCommentVotingTable.vote} = 1 THEN 1 ELSE NULL END) as int)`,
        downvotes: sql<number>`CAST(COUNT(CASE WHEN ${contentCommentVotingTable.vote} = -1 THEN 1 ELSE NULL END) as int)`,
        author: {
          id: userTable.id,
          username: userTable.username,
          avatar: userTable.avatar,
        },
      })
      .from(contentCommentTable)
      .where(
        and(
          eq(contentCommentTable.parentCommentId, commentId),
          isNull(contentCommentTable.parentCommentId),
          isNull(contentCommentTable.deletedAt),
        ),
      )
      .leftJoin(userTable, eq(userTable.id, contentCommentTable.authorId))
      .leftJoin(contentCommentVotingTable, eq(contentCommentVotingTable.commentId, contentCommentTable.id))
      .groupBy(contentCommentTable.id)
      .orderBy(contentCommentTable.createdAt, asc(contentCommentTable.createdAt))
      .all();

    return comments.map(comment => this.toCommentWithAuthor(comment));
  }

  toCommentWithAuthor(fromDatabase: CommentWithAuthorSelect): CommentWithAuthor {
    return {
      id: fromDatabase.id,
      createdAt: fromDatabase.createdAt,
      updatedAt: fromDatabase.updatedAt,
      contentId: fromDatabase.contentId,
      content: fromDatabase.content,
      parentCommentId: fromDatabase.parentCommentId,
      upvotes: fromDatabase.upvotes,
      downvotes: fromDatabase.downvotes,
      currentUserVote: 0,
      downvoteCount: fromDatabase.downvotes,
      upvoteCount: fromDatabase.upvotes,
      author: {
        id: fromDatabase.author!.id,
        username: fromDatabase.author!.username,
        avatar: fromDatabase.author!.avatar,
      },
    };
  }
}
