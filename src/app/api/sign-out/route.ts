import { auth } from '@/modules/auth/services/lucia';
import { handleApiAuthRequest } from '@/modules/auth/utils/handle-auth-request';
import { type NextRequest } from 'next/server';

export const POST = async (request: NextRequest) => {
  const authRequest = handleApiAuthRequest(request);

  const session = await authRequest.validate();

  if (!session) {
    return new Response(null, {
      status: 401,
    });
  }

  await auth.invalidateSession(session.sessionId);

  authRequest.setSession(null);

  return new Response(null, {
    status: 302,
    headers: {
      Location: '/',
    },
  });
};
