import { protectWithSessionMiddleware } from '@/modules/auth/middleware/protect-with-session';
import { db } from '@/modules/database/db';
import type { CustomContext } from '@/modules/http/types/context';
import { fail, ok } from '@/shared/lib/result';
import { and, eq } from 'drizzle-orm';
import { Hono } from 'hono';
import { todos } from '../../database/schema/todos';
import { todoSchema } from '../schemas/todo-schema';

export const todoApp = new Hono<CustomContext>()
  .use('/*', protectWithSessionMiddleware)
  .get('/', async (c) => {
    const user = c.get('currentUser');

    const list = await db
      .select()
      .from(todos)
      .where(eq(todos.userId, user.id))
      .orderBy(todos.createdAt);

    return c.json(ok(list));
  })
  .put('/', async (c) => {
    const user = c.get('currentUser');

    const body = await c.req.json();
    const validatedBody = todoSchema.safeParse(body);

    if (!validatedBody.success) {
      return c.json(fail('Invalid todo data'), 400);
    }

    const todo = await db
      .insert(todos)
      .values({
        ...validatedBody.data,
        userId: user.id,
      })
      .onConflictDoUpdate({
        target: [todos.id, todos.userId],
        set: validatedBody.data,
      })
      .returning()
      .then((rows) => rows.at(0));

    return c.json(ok(todo));
  })
  .delete('/:id', async (c) => {
    const user = c.get('currentUser');
    const id = c.req.param('id');

    const todo = await db
      .delete(todos)
      .where(and(eq(todos.id, Number(id)), eq(todos.userId, user.id)))
      .returning()
      .then((rows) => rows.at(0));

    return c.json(ok(todo));
  });
