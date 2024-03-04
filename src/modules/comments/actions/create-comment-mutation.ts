'use server';

import { getActionSession } from '@/modules/auth/utils/get-action-session';
import { isAuthenticated } from '@/modules/auth/utils/is';
import { log } from '@/modules/logging/lib/pino';
import { CommentRepository } from '../repositories/comment-repository';
import { newCommentSchema, type NewCommentSchema } from '../schemas/new-comment-schema';

export async function createCommentMutation(params: NewCommentSchema): Promise<void> {
  const session = await getActionSession();

  if (!isAuthenticated(session)) {
    throw new Error('Usuário não autenticado');
  }

  const validatedParams = newCommentSchema.safeParse(params);

  if (!validatedParams.success) {
    throw new Error('Parâmetros inválidos para criar comentário');
  }

  const commentRepository = new CommentRepository();

  await commentRepository.addCommentInContent({
    authorId: session.userId,
    contentId: params.contentId,
    content: params.content,
    parentCommentId: params.parentCommentId,
  });

  log.info('Comment created', { authorId: session.user.id });
}
