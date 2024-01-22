import type { Session } from '@/modules/auth/types/session';
import { isAuthenticated } from '@/modules/auth/utils/is';
import { type ContentNewCommentTable } from '@/modules/database/schema/comment';
import { log } from '@/modules/logging/lib/pino';
import { CommentRepository } from '../repositories/comment-repository';
import { newCommentSchema, type NewCommentSchema } from '../schemas/new-comment-schema';

export async function commentOnContentUseCase(
  params: NewCommentSchema,
  session: Session,
  commentRepository: CommentRepository = new CommentRepository(),
) {
  if (!isAuthenticated(session)) {
    throw new Error('Somente administradores podem criar trilhas.');
  }

  const validatedParams = newCommentSchema.safeParse(params);

  if (!validatedParams.success) {
    throw new Error('Parâmetros inválidos para criar nova trilha.');
  }

  const newComment: ContentNewCommentTable = {
    authorId: session.userId,
    contentId: params.contentId,
    content: params.content,
    parentCommentId: params.parentCommentId,
  };

  await commentRepository.addCommentInContent(newComment);

  log.info('Comment created', { authorId: session.user.id });
}
