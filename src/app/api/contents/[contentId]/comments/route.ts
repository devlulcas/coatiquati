import { handleApiAuthRequest } from '@/modules/auth/utils/handle-auth-request';
import { getCommentsOnContentUseCase } from '@/modules/comments/use-cases/get-comments-on-content-use-case';
import { NextResponse, type NextRequest } from 'next/server';

type Params = {
  contentId: string;
};

export const GET = async (request: NextRequest, params: Params) => {
  const authRequest = handleApiAuthRequest(request);
  const session = await authRequest.validate();
  const comments = getCommentsOnContentUseCase.execute(+params.contentId, session);
  return NextResponse.json(comments);
};
