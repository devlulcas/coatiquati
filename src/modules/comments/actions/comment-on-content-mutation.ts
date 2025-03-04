'use server';

import { validateRequest } from '@/modules/auth/services/lucia';
import { isAuthenticated } from '@/modules/auth/utils/is';
import { db } from '@/modules/database/db';
import { type NewComment } from '@/modules/database/schema/comment';
import { log } from '@/modules/logging/lib/pino';
import { fail, ok, wrapAsyncInResult, type Result } from '@/shared/lib/result';
import { CommentRepository } from '../repositories/comment-repository';
import { newCommentSchema, type NewCommentSchema } from '../schemas/new-comment-schema';

export async function commentOnContentMutation(params: NewCommentSchema): Promise<Result<string>> {
  const { user } = await validateRequest();

  if (!isAuthenticated(user)) {
    return fail('Somente usuários logados podem comentar.');
  }

  const validatedParams = newCommentSchema.safeParse(params);

  if (!validatedParams.success) {
    return fail('Parâmetros inválidos para criar um comentário.');
  }

  const SIXTY_SECONDS = 60000;

  const lastCommentResult = await wrapAsyncInResult(
    db.query.commentTable.findFirst({
      where: (fields, operators) => {
        return operators.and(
          operators.eq(fields.authorId, user.id),
          operators.gt(fields.createdAt, new Date(Date.now() - SIXTY_SECONDS)),
        );
      },
    }),
  );

  if (lastCommentResult.type === 'ok' && lastCommentResult.value) {
    log.warn('Tentativa de comentar muito rápido', { userId: user.id });
    return fail('Espere 60 segundos para comentar novamente');
  }

  const newComment: NewComment = {
    authorId: user.id,
    contentId: params.contentId,
    content: params.content,
    parentCommentId: params.parentCommentId,
  };

  const commentRepository = new CommentRepository();

  try {
    await commentRepository.addCommentInContent(newComment);

    log.info('Comentário criado', { authorId: user.id, on: 'content', contentId: params.contentId });

    return ok('Comentário criado com sucesso');
  } catch (error) {
    log.error('Erro ao criar comentário', {
      authorId: user.id,
      on: 'content',
      contentId: params.contentId,
      error,
    });

    return fail('Erro ao criar comentário');
  }
}
