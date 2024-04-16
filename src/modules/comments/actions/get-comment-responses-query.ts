'use server';

import { log } from '@/modules/logging/lib/pino';
import { asyncResult, fail, type Result } from '@/shared/lib/result';
import { CommentRepository } from '../repositories/comment-repository';
import type { Comment } from '../types/comment';

export async function getCommentResponsesQuery(commentId: number): Promise<Result<Comment[]>> {
  const commentRepository = new CommentRepository();
  const commentsResult = await asyncResult(commentRepository.getCommentResponsesByCommentId(commentId));

  if (commentsResult.type === 'fail') {
    log.error('Erro ao buscar respostas de comentário', { commentId, error: commentsResult.fail });
    return fail('Erro ao buscar respostas de comentário');
  }

  return commentsResult;
}
