import { db } from '@/modules/database/db';
import { type InsertComment } from '@/modules/database/schema/comment';
import type { Comment } from '../types/comment';

export class CommentRepository {
  async addCommentInContent(comment: InsertComment): Promise<void> {
    const newComment = await db
      .insert(comment)
      .values(comment)
      .returning({ id: comment.id })
      .execute();

    if (!newComment.length) {
      throw new Error('Erro ao adicionar comentário');
    }
  }

  async getRootComments(contentId: number): Promise<Comment[]> {
    return db.query.commentTable.findMany({
      where: (fields, operators) => {
        return operators.and(
          operators.eq(fields.contentId, contentId),
          operators.isNull(fields.parentCommentId),
          operators.isNull(fields.deletedAt)
        );
      },
      with: {
        author: true,
      },
    });
  }

  async getCommentResponsesByCommentId(commentId: number): Promise<Comment[]> {
    return db.query.commentTable.findMany({
      where: (fields, operators) => {
        return operators.and(
          operators.eq(fields.parentCommentId, commentId),
          operators.isNull(fields.deletedAt)
        );
      },
      with: {
        author: true,
      },
    });
  }

  async getCommentById(commentId: number): Promise<Comment | undefined> {
    return db.query.commentTable.findFirst({
      where: (fields, operators) => {
        return operators.and(
          operators.eq(fields.id, commentId),
          operators.isNull(fields.deletedAt)
        );
      },
      with: {
        author: true,
      },
    });
  }
}
