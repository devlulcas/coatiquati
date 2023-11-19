import { auth } from '@/modules/auth/services/lucia';
import { handleApiAuthRequest } from '@/modules/auth/utils/handle-auth-request';
import { NextResponse, type NextRequest } from 'next/server';

export const GET = async (request: NextRequest) => {
  const authRequest = handleApiAuthRequest(request);
  const session = await authRequest.validate();

  if (!session) {
    return new Response(null, {
      status: 401,
    });
  }

  const user = await auth.getUser(session.userId);

  return NextResponse.json({
    id: user.id,
    username: user.username,
    role: user.role,
    emailVerified: user.emailVerified,
  });
};
