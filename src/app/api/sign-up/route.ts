import { roles } from '@/modules/auth/constants/roles';
import { userSignUpSchema } from '@/modules/auth/schemas/user-sign-up-schema';
import { auth } from '@/modules/auth/services/lucia';
import { formDataToObject } from '@/shared/utils/form-data-to-object';
import { cookies } from 'next/headers';
import { NextResponse, type NextRequest } from 'next/server';

export const POST = async (request: NextRequest) => {
  const formData = await request.formData();

  const formDataResult = userSignUpSchema.safeParse(formDataToObject(formData));

  if (!formDataResult.success) {
    return NextResponse.json({ error: 'Invalid username' }, { status: 400 });
  }

  const username = formDataResult.data.username.toLowerCase();

  const email = formDataResult.data.email.toLowerCase();

  try {
    const user = await auth.createUser({
      key: {
        providerId: 'username',
        providerUserId: username,
        password: formDataResult.data.password,
      },
      attributes: {
        username,
        email,
        role: roles.USER,
      },
    });

    const session = await auth.createSession({
      userId: user.userId,
      attributes: {
        id: user.userId,
      },
    });

    const authRequest = auth.handleRequest({
      request,
      cookies,
    });

    authRequest.setSession(session);

    return new Response(null, {
      status: 302,
      headers: {
        Location: '/',
      },
    });
  } catch (e) {
    console.error(e);

    return NextResponse.json(
      { error: 'An unknown error occurred' },
      { status: 500 }
    );
  }
};
