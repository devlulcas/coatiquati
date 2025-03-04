import { protectWithSessionMiddleware } from '@/modules/auth/middleware/protect-with-session';
import { getCommentResponsesQuery } from '@/modules/comments/actions/get-comment-responses-query';
import { CommentRepository } from '@/modules/comments/repositories/comment-repository';
import type { CustomContext } from '@/modules/http/types/context';
import { log } from '@/modules/logging/lib/pino';
import { isFail } from '@/shared/lib/result';
import { Hono } from 'hono';

export const commentsApp = new Hono<CustomContext>();

commentsApp.get('/:commentId/responses', async c => {
  const comments = await getCommentResponsesQuery(Number(c.req.param('commentId')));

  if (isFail(comments)) {
    return c.json([], { status: 404 });
  }

  return c.json(comments.value);
});

commentsApp.post('/:commentId/responses', protectWithSessionMiddleware, async c => {
  const { content } = await c.req.json();
  const user = c.get('currentUser');

  const commentRepository = new CommentRepository();

  const commentId = Number(c.req.param('commentId'));

  const comment = await commentRepository.getCommentById(commentId);

  if (!comment) {
    return c.json({ error: 'Comentário não encontrado' }, { status: 404 });
  }

  try {
    await commentRepository.addCommentInContent({
      authorId: user.id,
      contentId: comment.contentId,
      parentCommentId: comment.id,
      content,
    });

    log.info('Comentário respondido', { authorId: user.id, on: comment.id, contentId: comment.contentId });
    return c.json({ message: 'Comentário respondido' });
  } catch (error) {
    log.error('Erro ao criar comentário', { error });
    return c.json({ error: 'Erro ao criar comentário' }, { status: 500 });
  }
});
