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
    const avatars = ['grape.png', 'mint.png', 'original.png', 'peach.png'];

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
        avatar: '/avatars/' + avatars[Math.floor(Math.random() * avatars.length)],
        is_banned: Number(false),
        email_verified: Number(false),
        deleted_at: null,
      },
    });

    const session = await auth.createSession({
      userId: user.userId,
      attributes: { id: user.userId },
    });

    const authRequest = handleApiAuthRequest(request);

    authRequest.setSession(session);

    return new Response(null, {
      status: 302,
      headers: {
        Location: '/',
      },
    });
  } catch (error) {
    log.error('Erro ao criar usuário' + error);
    return NextResponse.json({ error: 'An unknown error occurred' }, { status: 500 });
  }
};
