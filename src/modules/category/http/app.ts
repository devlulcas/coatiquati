import { protectWithPermissionMiddlewareFactory } from '@/modules/auth/middleware/protect-with-permission';
import { protectWithSessionMiddleware } from '@/modules/auth/middleware/protect-with-session';
import { searchTrailCategoriesQuery } from '@/modules/category/actions/search-trails-categories-query';
import type { CustomContext } from '@/modules/http/types/context';
import { isFail } from '@/shared/lib/result';
import { Hono } from 'hono';

export const categoriesApp = new Hono<CustomContext>();

categoriesApp.use('/*', protectWithSessionMiddleware, protectWithPermissionMiddlewareFactory());

categoriesApp.get('/', async c => {
  const skip = Number(c.req.query('skip')) || 0;
  const take = Number(c.req.query('take')) || 10;
  const search = c.req.query('search') || '';

  const categoriesResult = await searchTrailCategoriesQuery({ skip, take, search });

  if (isFail(categoriesResult)) {
    return c.json(
      {
        data: {
          categories: [],
        },
      },
      { status: 404 },
    );
  }

  const categories = categoriesResult.value.map(({ name }) => ({ name }));

  return c.json({
    data: { categories },
    pagination: { skip, take },
  });
});
