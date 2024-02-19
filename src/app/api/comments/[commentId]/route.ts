import { handleApiAuthRequest } from '@/modules/auth/utils/handle-auth-request';
import { getCommentResponsesUseCase } from '@/modules/comments/use-cases/get-comment-responses-use-case';
import { NextResponse, type NextRequest } from 'next/server';

type Params = {
  commentId: string;
};

export const GET = async (request: NextRequest, params: Params) => {
  const authRequest = handleApiAuthRequest(request);
  const session = await authRequest.validate();
  console.log('session', session);
  const comments = getCommentResponsesUseCase.execute(+params.commentId, session);
  return NextResponse.json(comments);
};
