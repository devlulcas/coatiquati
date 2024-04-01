import { requestAccountVerificationMutation } from '@/modules/auth/actions/request-account-verification-mutation';
import { roles } from '@/modules/auth/constants/roles';
import { userSignUpSchema } from '@/modules/auth/schemas/user-sign-up-schema';
import { auth } from '@/modules/auth/services/lucia';
import { handleApiAuthRequest } from '@/modules/auth/utils/handle-auth-request';
import { log } from '@/modules/logging/lib/pino';
import { formDataToObject } from '@/shared/utils/form-data-to-object';
import { NextResponse, type NextRequest } from 'next/server';

export const POST = async (request: NextRequest) => {
  const formData = await request.formData();

  const formDataResult = userSignUpSchema.safeParse(formDataToObject(formData));

  if (!formDataResult.success) {
    return NextResponse.json({ error: 'Invalid username' }, { status: 400 });
  }

  const username = formDataResult.data.username.toLowerCase().trim();

  const email = formDataResult.data.email.toLowerCase().trim();

  try {
    const user = await auth.createUser({
      key: {
        providerId: 'username',
        providerUserId: username,
        password: formDataResult.data.password,
      },
      attributes: {
        username: username,
        email,
        role: roles.USER,
        avatar: 'default-user-avatar.png',
        isBanned: Number(false),
        verified: Number(false),
      },
    });

    const session = await auth.createSession({
      userId: user.userId,
      attributes: { id: user.userId },
    });

    const authRequest = handleApiAuthRequest(request);

    authRequest.setSession(session);

    try {
      await requestAccountVerificationMutation(session);
    } catch (error) {
      log.error('Erro ao enviar email de verificação', { error });
      await auth.invalidateAllUserSessions(user.userId);
      return NextResponse.json({ error: 'An unknown error occurred' }, { status: 500 });
    }

    return new Response(null, {
      status: 302,
      headers: {
        Location: '/',
      },
    });
  } catch (error) {
    log.error('Erro ao criar usuário', { error });
    return NextResponse.json({ error: 'An unknown error occurred' }, { status: 500 });
  }
};
