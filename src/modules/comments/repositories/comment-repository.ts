import { db } from '@/modules/database/db';
import { contentCommentTable, type ContentNewCommentTable } from '@/modules/database/schema/comment';
import { CONTRIBUTOR_DB_FIELDS } from '@/modules/user/repositories/user-repository';
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

  async getCommentsByContentId(contentId: number, database = db): Promise<CommentWithAuthor[]> {
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
    }));
  }

  async getCommentResponsesByCommentId(commentId: number, database = db): Promise<CommentWithAuthor[]> {
    const comments = await database.query.contentCommentTable.findMany({
      columns: COMMENT_DB_FIELDS,
      where(fields, operators) {
        return operators.and(operators.eq(fields.parentCommentId, commentId), operators.isNull(fields.deletedAt));
      },
      with: {
        author: {
          columns: CONTRIBUTOR_DB_FIELDS,
        },
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
    }));
  }
}
