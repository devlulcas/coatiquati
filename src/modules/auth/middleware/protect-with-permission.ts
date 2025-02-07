import type { CustomContext } from '@/modules/http/types/context';
import { fail } from '@/shared/lib/result';
import { createMiddleware } from 'hono/factory';
import { HTTPException } from 'hono/http-exception';
import { roles, type Role } from '../constants/roles';
import { hasPermission } from '../utils/is';

export const protectWithPermissionMiddlewareFactory = (
  role: Role[] = [roles.ADMIN, roles.HIGH_PRIVILEGE_ADMIN],
) =>
  createMiddleware<CustomContext>(async (c, next) => {
    const user = c.get('currentUser');

    if (!hasPermission(user.role, role)) {
      throw new HTTPException(401, {
        res: c.json(fail('Você não tem permissão o suficiente para realizar essa ação')),
      });
    }

    await next();
  });
