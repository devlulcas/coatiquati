import type { CustomContext } from '@/modules/http/types/context';
import { log } from '@/modules/logging/lib/pino';
import { getUserById } from '@/modules/user/repositories/user-repository';
import { isFail, wrapAsyncInResult } from '@/shared/lib/result';
import { fail } from 'assert';
import { getCookie } from 'hono/cookie';
import { createMiddleware } from 'hono/factory';
import { HTTPException } from 'hono/http-exception';
import { auth, toPublicSession } from '../services/lucia';

export const protectWithSessionMiddleware = createMiddleware<CustomContext>(async (c, next) => {
  const sessionCookie = getCookie(c, auth.sessionCookieName);

  log.debug(sessionCookie);

  if (!sessionCookie) {
    throw new HTTPException(401, { res: c.json(fail('Faça login para realizar essa ação')) });
  }

  const { session, user } = await auth.validateSession(sessionCookie);

  if (!session || !user) {
    throw new HTTPException(401, { res: c.json(fail('Faça login para realizar essa ação')) });
  }

  const profileResult = await wrapAsyncInResult(getUserById(user.id));

  if (isFail(profileResult) || !profileResult.value) {
    throw new HTTPException(401, { res: c.json(fail('Faça login para realizar essa ação')) });
  }

  c.set('session', session);
  c.set('currentUser', profileResult.value);
  c.set('publicSession', toPublicSession(profileResult.value));
  await next();
});
