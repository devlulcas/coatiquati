import { handleApiAuthRequest } from '@/modules/auth/utils/handle-auth-request';
import { getCommentResponsesQuery } from '@/modules/comments/actions/get-comment-responses-query';
import { CommentRepository } from '@/modules/comments/repositories/comment-repository';
import type { Comment } from '@/modules/comments/types/comment';
import { log } from '@/modules/logging/lib/pino';
import { redirect } from 'next/navigation';
import { NextResponse, type NextRequest } from 'next/server';

type RouteProps = {
  params: {
    commentId: string;
  };
};

export const GET = async (_: NextRequest, { params }: RouteProps): Promise<NextResponse<Comment[]>> => {
  const comments = await getCommentResponsesQuery(Number(params.commentId));
  return NextResponse.json(comments);
};

export const POST = async (
  request: NextRequest,
  { params }: RouteProps,
): Promise<NextResponse<{ message: string } | { error: string }>> => {
  const authRequest = handleApiAuthRequest(request);

  const session = await authRequest.validate();

  if (!session) {
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
      authorId: session.user.id,
      contentId: comment.contentId,
      parentCommentId: comment.id,
      content,
    });

    log.info('Comentário respondido', { authorId: session.user.id, on: comment.id, contentId: comment.contentId });

    return NextResponse.json({ message: 'Comentário respondido' });
  } catch (error) {
    log.error('Erro ao criar comentário', { error });

    return NextResponse.json({ error: 'Erro ao criar comentário' }, { status: 500 });
  }
};
