import { db } from '@/modules/database/db';
import { contentCommentTable, type ContentNewCommentTable } from '@/modules/database/schema/comment';
import type { Comment } from '../types/comment';

export class CommentRepository {
  async addCommentInContent(comment: ContentNewCommentTable): Promise<void> {
    const SIXTY_SECONDS = 60000;

    const lastComment = await db.query.contentCommentTable.findFirst({
      where: (fields, operators) => {
        return operators.and(
          operators.eq(fields.authorId, comment.authorId),
          operators.gt(fields.createdAt, new Date(Date.now() - SIXTY_SECONDS)),
        );
      },
    });

    if (lastComment) {
      throw new Error('Espere 60 segundos para comentar novamente');
    }

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
        author: true,
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
        author: true,
        votes: {
          columns: { vote: true, userId: true },
        },
      },
    });
  }

  async getCommentById(commentId: number): Promise<Comment | undefined> {
    return db.query.contentCommentTable.findFirst({
      where: (fields, operators) => {
        return operators.and(operators.eq(fields.id, commentId), operators.isNull(fields.deletedAt));
      },
      with: {
        author: true,
        votes: {
          columns: { vote: true, commentId: true, userId: true },
        },
      },
    });
  }
}
