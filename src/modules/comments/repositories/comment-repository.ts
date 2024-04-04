import { db } from '@/modules/database/db';
import { contentCommentTable, type ContentNewCommentTable } from '@/modules/database/schema/comment';
import { USER_DB_FIELDS } from '@/modules/user/repositories/user-repository';
import type { Comment } from '../types/comment';

export class CommentRepository {
  async addCommentInContent(comment: ContentNewCommentTable): Promise<void> {
    const newComment = await db
      .insert(contentCommentTable)
      .values(comment)
      .returning({ id: contentCommentTable.id })
      .execute();

    if (!newComment.length) {
      throw new Error('Erro ao adicionar comentário');
    }
  }

  async getRootComments(contentId: number): Promise<Comment[]> {
    return db.query.contentCommentTable.findMany({
      where: (fields, operators) => {
        return operators.and(
          operators.eq(fields.contentId, contentId),
          operators.isNull(fields.parentCommentId),
          operators.isNull(fields.deletedAt),
        );
      },
      with: {
        author: {
          columns: USER_DB_FIELDS,
        },
        votes: {
          columns: { vote: true, commentId: true, userId: true },
        },
      },
    });
  }

  async getCommentResponsesByCommentId(commentId: number): Promise<Comment[]> {
    return db.query.contentCommentTable.findMany({
      where: (fields, operators) => {
        return operators.and(operators.eq(fields.parentCommentId, commentId), operators.isNull(fields.deletedAt));
      },
      with: {
        author: {
          columns: USER_DB_FIELDS,
        },
        votes: {
          columns: { vote: true, commentId: true, userId: true },
        },
      },
    });
  }
}
