import { handleApiAuthRequest } from '@/modules/auth/utils/handle-auth-request';
import { getCommentResponsesUseCase } from '@/modules/comments/use-cases/get-comment-responses-use-case';
import { getCommentsOnContentUseCase } from '@/modules/comments/use-cases/get-comments-on-content-use-case';
import { NextResponse, type NextRequest } from 'next/server';

export const GET = async (request: NextRequest) => {
  const authRequest = handleApiAuthRequest(request);
  const session = await authRequest.validate();
  const contentId = Number(request.nextUrl.searchParams.get('content'));
  const commentId = Number(request.nextUrl.searchParams.get('comment'));

  if (!contentId) {
    return NextResponse.json([]);
  }

  if (commentId) {
    const responses = getCommentResponsesUseCase.execute(commentId, session);
    return NextResponse.json(responses);
  }

  const comments = getCommentsOnContentUseCase.execute(contentId, session);
  return NextResponse.json(comments);
};
