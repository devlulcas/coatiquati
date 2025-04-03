import type { CustomContext } from '@/modules/http/types/context';
import { getUserById } from '@/modules/user/repositories/user-repository';
import { isFail, wrapAsyncInResult } from '@/shared/lib/result';
import { fail } from 'assert';
import { createMiddleware } from 'hono/factory';
import { HTTPException } from 'hono/http-exception';
import { validateRequest } from '../services/next';

export const protectWithSessionMiddleware = createMiddleware<CustomContext>(async (c, next) => {
  const { data: user } = await validateRequest()

  if (!user) {
    throw new HTTPException(401, { res: c.json(fail('Faça login para realizar essa ação')) });
  }

  const profileResult = await wrapAsyncInResult(getUserById(user.id));

  if (isFail(profileResult) || !profileResult.value) {
    throw new HTTPException(401, { res: c.json(fail('Faça login para realizar essa ação')) });
  }

  c.set('currentUser', profileResult.value);
  await next();
});
