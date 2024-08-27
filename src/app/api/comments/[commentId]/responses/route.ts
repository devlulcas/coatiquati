import { validateRequest } from '@/modules/auth/services/lucia';
import { getCommentResponsesQuery } from '@/modules/comments/actions/get-comment-responses-query';
import { CommentRepository } from '@/modules/comments/repositories/comment-repository';
import type { Comment } from '@/modules/comments/types/comment';
import { log } from '@/modules/logging/lib/pino';
import { isFail } from '@/shared/lib/result';
import { redirect } from 'next/navigation';
import { NextResponse, type NextRequest } from 'next/server';

type RouteProps = {
  params: {
    commentId: string;
  };
};

export const GET = async (_: NextRequest, { params }: RouteProps): Promise<NextResponse<Comment[]>> => {
  const comments = await getCommentResponsesQuery(Number(params.commentId));

  if (isFail(comments)) {
    return NextResponse.json([], { status: 404 });
  }

  return NextResponse.json(comments.value);
};

export const POST = async (
  request: NextRequest,
  { params }: RouteProps,
): Promise<NextResponse<{ message: string } | { error: string }>> => {
  const { user } = await validateRequest();

  if (!user) {
    redirect('/sign-in');
  }

  const { content } = await request.json();

  const commentRepository = new CommentRepository();

  const commentId = Number(params.commentId);

  const comment = await commentRepository.getCommentById(commentId);

  if (!comment) {
    return NextResponse.json({ error: 'Comentário não encontrado' }, { status: 404 });
  }

  try {
    await commentRepository.addCommentInContent({
      authorId: user.id,
      contentId: comment.contentId,
      parentCommentId: comment.id,
      content,
    });

    log.info('Comentário respondido', { authorId: user.id, on: comment.id, contentId: comment.contentId });

    return NextResponse.json({ message: 'Comentário respondido' });
  } catch (error) {
    log.error('Erro ao criar comentário', { error });

    return NextResponse.json({ error: 'Erro ao criar comentário' }, { status: 500 });
  }
};
