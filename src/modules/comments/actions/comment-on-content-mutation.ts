'use server';

import { getActionSession } from '@/modules/auth/utils/get-action-session';
import { isAuthenticated } from '@/modules/auth/utils/is';
import { db } from '@/modules/database/db';
import { type ContentNewCommentTable } from '@/modules/database/schema/comment';
import { log } from '@/modules/logging/lib/pino';
import { asyncResult, fail, ok, type Result } from '@/shared/lib/result';
import { CommentRepository } from '../repositories/comment-repository';
import { newCommentSchema, type NewCommentSchema } from '../schemas/new-comment-schema';

export async function commentOnContentMutation(params: NewCommentSchema): Promise<Result<string>> {
  const session = await getActionSession();

  if (!isAuthenticated(session)) {
    return fail('Somente usuários logados podem comentar.');
  }

  const validatedParams = newCommentSchema.safeParse(params);

  if (!validatedParams.success) {
    return fail('Parâmetros inválidos para criar um comentário.');
  }

  const SIXTY_SECONDS = 60000;

  const lastCommentResult = await asyncResult(
    db.query.contentCommentTable.findFirst({
      where: (fields, operators) => {
        return operators.and(
          operators.eq(fields.authorId, session.userId),
          operators.gt(fields.createdAt, new Date(Date.now() - SIXTY_SECONDS)),
        );
      },
    }),
  );

  if (lastCommentResult.type === 'ok' && lastCommentResult.value) {
    log.warn('Tentativa de comentar muito rápido', { userId: session.userId });
    return fail('Espere 60 segundos para comentar novamente');
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

    return ok('Comentário criado com sucesso');
  } catch (error) {
    log.error('Erro ao criar comentário', {
      authorId: session.user.id,
      on: 'content',
      contentId: params.contentId,
      error,
    });

    return fail('Erro ao criar comentário');
  }
}
