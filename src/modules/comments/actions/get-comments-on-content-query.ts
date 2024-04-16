'use server';

import { log } from '@/modules/logging/lib/pino';
import { asyncResult, fail, type Result } from '@/shared/lib/result';
import { CommentRepository } from '../repositories/comment-repository';
import type { Comment } from '../types/comment';

export async function getCommentsOnContentQuery(contentId: number): Promise<Result<Comment[]>> {
  const commentRepository = new CommentRepository();
  const commentsResult = await asyncResult(commentRepository.getRootComments(contentId));

  if (commentsResult.type === 'fail') {
    log.error('Erro ao buscar comentários', { contentId, error: commentsResult.fail });
    return fail('Erro ao buscar comentários');
  }

  return commentsResult;
}
