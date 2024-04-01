import { checkAccountVerificationTokenMutation } from '@/modules/auth/actions/check-account-verification-token-mutation';
import { handleApiAuthRequest } from '@/modules/auth/utils/handle-auth-request';
import { log } from '@/modules/logging/lib/pino';
import { NextResponse, type NextRequest } from 'next/server';

export const GET = async (request: NextRequest) => {
  const token = request.nextUrl.searchParams.get('token') ?? '';

  try {
    const session = await checkAccountVerificationTokenMutation(token);

    const authRequest = handleApiAuthRequest(request);

    authRequest.setSession(session);

    return new Response(null, {
      status: 302,
      headers: { Location: '/' },
    });
  } catch (error) {
    log.error('Erro ao verificar token de verificação de conta', { error });
    return NextResponse.json({ error: 'An unknown error occurred' }, { status: 500 });
  }
};
