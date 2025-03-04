import { protectWithSessionMiddleware } from '@/modules/auth/middleware/protect-with-session';
import type { CustomContext } from '@/modules/http/types/context';
import { Hono } from 'hono';
import { getUsersQuery } from '../actions/get-users-query';

export const usersApp = new Hono<CustomContext>();

usersApp.get('/', async (c) => {
  const url = new URL(c.req.url)

  const res = await getUsersQuery({
    search: url.searchParams.get('search') ?? undefined,
    skip: Number(url.searchParams.get('skip') || 0),
    take: Number(url.searchParams.get('skip') || 30),
  })

  return c.json(res);
});

usersApp.get('/me', protectWithSessionMiddleware, async (c) => {
  const user = c.get('currentUser');

  if (!user) {
    return c.json(null, {
      status: 401,
    });
  }

  return c.json({
    id: user.id,
    username: user.username,
    role: user.role,
    verifiedAt: user.verifiedAt,
  });
});
