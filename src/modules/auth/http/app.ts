import type { CustomContext } from '@/modules/http/types/context';
import { isOk } from '@/shared/lib/result';
import { Hono } from 'hono';
import { cookies } from 'next/headers';
import { verifyEmailMutation } from '../actions/verify-email-mutation';

export const authApp = new Hono<CustomContext>();

authApp.get('/verify-account', async c => {
  const url = new URL(c.req.url);
  const token = url.searchParams.get('token') ?? '';
  const res = await verifyEmailMutation(token);
  const jar = cookies();

  if (isOk(res)) {
    jar.set(res.value.sessionCookie.name, res.value.sessionCookie.value, res.value.sessionCookie.attributes);
    return c.redirect('/dashboard');
  } else {
    return c.json(res);
  }
});
