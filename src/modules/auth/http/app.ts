import type { CustomContext } from '@/modules/http/types/context';
import { getUserById } from '@/modules/user/repositories/user-repository';
import { isFail, isOk, wrapAsyncInResult } from '@/shared/lib/result';
import { Hono } from 'hono';
import { getCookie } from 'hono/cookie';
import { cookies } from 'next/headers';
import { verifyEmailMutation } from '../actions/verify-email-mutation';
import { auth } from '../services/lucia';
import type { PublicSession } from '../types/session';

export const authApp = new Hono<CustomContext>();

authApp.get('/verify-account', async c => {
  const url = new URL(c.req.url);
  const token = url.searchParams.get('token') ?? '';
  const res = await verifyEmailMutation(token);
  const jar = await cookies();

  if (isOk(res)) {
    jar.set(res.value.sessionCookie.name, res.value.sessionCookie.value, res.value.sessionCookie.attributes);
    return c.redirect('/dashboard');
  } else {
    return c.json(res);
  }
});

authApp.get('/session', async c => {
  const sessionCookie = getCookie(c, auth.sessionCookieName);

  const psEmpty: PublicSession = {
    data: null,
    status: 'unauthenticated',
  }

  if (!sessionCookie) {
    return c.json({ session: psEmpty });
  }

  const { session, user } = await auth.validateSession(sessionCookie);

  if (!session || !user) {
    return c.json({ session: psEmpty });
  }

  const profileResult = await wrapAsyncInResult(getUserById(user.id));

  if (isFail(profileResult) || !profileResult.value) {
    return c.json({ session: psEmpty });
  }

  const psFilled: PublicSession = {
    data: profileResult.value,
    status: 'authenticated',
  }

  return c.json({ session: psFilled });
})
