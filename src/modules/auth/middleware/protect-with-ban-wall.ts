import type { CustomContext } from '@/modules/http/types/context';
import { createMiddleware } from 'hono/factory';
import { HTTPException } from 'hono/http-exception';
import { fail } from 'node:assert';

export const protectWithBanWallMiddleware = createMiddleware<CustomContext>(
  async (c, next) => {
    const user = c.get('currentUser');

    if (user.banned) {
      throw new HTTPException(403, {
        res: c.json(fail('Você foi banido do sistema')),
      });
    }

    await next();
  }
);
