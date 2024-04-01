import { db } from '@/modules/database/db';
import { commentVoteTable, contentCommentTable, type ContentNewCommentTable } from '@/modules/database/schema/comment';
import { userTable } from '@/modules/database/schema/user';
import { and, asc, eq, isNull } from 'drizzle-orm';
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
      .leftJoin(commentVoteTable, eq(commentVoteTable.commentId, contentCommentTable.id))
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
      author: {
        id: fromDatabase.author!.id,
        username: fromDatabase.author!.username,
        avatar: fromDatabase.author!.avatar ?? 'default-user-avatar.png',
      },
    };
  }
}
