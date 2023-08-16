import { userSignInSchema } from '@/modules/auth/schemas/user-sign-in-schema';
import { auth } from '@/modules/auth/services/lucia';
import { formDataToObject } from '@/shared/utils/form-data-to-object';
import { LuciaError } from 'lucia';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

import type { NextRequest } from 'next/server';

export const POST = async (request: NextRequest) => {
  const formData = await request.formData();

  const formDataResult = userSignInSchema.safeParse(formDataToObject(formData));

  if (!formDataResult.success) {
    return NextResponse.json({ error: 'Invalid username' }, { status: 400 });
  }

  const username = formDataResult.data.username.toLowerCase();

  const password = formDataResult.data.password;

  try {
    const user = await auth.useKey(
      'username',
      username.toLowerCase(),
      password
    );

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
    console.log(e);

    if (isWrongPasswordError(e)) {
      return NextResponse.json(
        { error: 'Incorrect username or password' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'An unknown error occurred' },
      { status: 500 }
    );
  }
};

function isWrongPasswordError(e: unknown) {
  if (e instanceof LuciaError) {
    return (
      e.message === 'AUTH_INVALID_KEY_ID' ||
      e.message === 'AUTH_INVALID_PASSWORD'
    );
  }
}
