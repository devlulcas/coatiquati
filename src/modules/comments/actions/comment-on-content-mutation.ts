'use server';

import { getActionSession } from '@/modules/auth/utils/get-action-session';
import { isAuthenticated } from '@/modules/auth/utils/is';
import { type ContentNewCommentTable } from '@/modules/database/schema/comment';
import { log } from '@/modules/logging/lib/pino';
import { CommentRepository } from '../repositories/comment-repository';
import { newCommentSchema, type NewCommentSchema } from '../schemas/new-comment-schema';

export async function commentOnContentMutation(params: NewCommentSchema) {
  const session = await getActionSession();
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

  const commentRepository = new CommentRepository();

  try {
    await commentRepository.addCommentInContent(newComment);
    log.info('Comentário criado', { authorId: session.user.id, on: 'content', contentId: params.contentId });
  } catch (error) {
    log.error('Erro ao criar comentário', { error });
    throw new Error('Erro ao criar comentário');
  }
}
