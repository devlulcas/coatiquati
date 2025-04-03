import type { CustomContext } from '@/modules/http/types/context';
import { isOk } from '@/shared/lib/result';
import { Hono } from 'hono';
import { verifyEmailMutation } from '../actions/verify-email-mutation';
import { setSessionTokenCookie, validateRequest } from '../services/next';

export const authApp = new Hono<CustomContext>();

authApp.get('/verify-account', async c => {
  const url = new URL(c.req.url);
  const token = url.searchParams.get('token') ?? '';
  const res = await verifyEmailMutation(token);

  if (isOk(res)) {
    await setSessionTokenCookie(res.value.token, res.value.session.expiresAt)
    return c.redirect('/dashboard');
  } else {
    return c.json(res);
  }
});

authApp.get('/session', async c => {
  const r = await validateRequest()
  return c.json({ session: r });
})
