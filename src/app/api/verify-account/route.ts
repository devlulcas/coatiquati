import { CheckAccountVerificationTokenUseCase } from '@/modules/auth/use-cases/check-account-verification-token-use-case';
import { handleApiAuthRequest } from '@/modules/auth/utils/handle-auth-request';
import { type NextRequest, NextResponse } from 'next/server';

export const GET = async (request: NextRequest) => {
  const token = request.nextUrl.searchParams.get('token') ?? '';

  try {
    const checkAccountVerificationTokenUseCase = new CheckAccountVerificationTokenUseCase();
    const session = await checkAccountVerificationTokenUseCase.execute({ token });

    const authRequest = handleApiAuthRequest(request);

    authRequest.setSession(session);

    return new Response(null, {
      status: 302,
      headers: { Location: '/' },
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'An unknown error occurred' }, { status: 500 });
  }
};
