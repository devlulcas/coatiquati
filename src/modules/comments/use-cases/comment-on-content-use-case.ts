import type { Session } from '@/modules/auth/types/session';
import { isAuthenticated } from '@/modules/auth/utils/is';
import { type ContentNewCommentTable } from '@/modules/database/schema/comment';
import { log } from '@/modules/logging/lib/pino';
import { CommentRepository } from '../repositories/comment-repository';
import { newCommentSchema, type NewCommentSchema } from '../schemas/new-comment-schema';

export class CommentOnContentUseCase {
  constructor(private readonly commentRepository: CommentRepository = new CommentRepository()) {}

  async execute(params: NewCommentSchema, session: Session) {
    if (!isAuthenticated(session)) {
      throw new Error('Somente usuários logados podem comentar.');
    }

    const validatedParams = newCommentSchema.safeParse(params);

    if (!validatedParams.success) {
      throw new Error('Parâmetros inválidos para criar um comentário.');
    }

    const newComment: ContentNewCommentTable = {
      authorId: session.userId,
      contentId: params.contentId,
      content: params.content,
      parentCommentId: params.parentCommentId,
    };

    await this.commentRepository.addCommentInContent(newComment);

    log.info('Comment created', { authorId: session.user.id });
  }
}

export const commentOnContentUseCase = new CommentOnContentUseCase();
