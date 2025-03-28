import { protectWithSessionMiddleware } from '@/modules/auth/middleware/protect-with-session';
import { db } from '@/modules/database/db';
import type { CustomContext } from '@/modules/http/types/context';
import { log } from '@/modules/logging/lib/pino';
import { fail, isFail, ok, wrapAsyncInResult } from '@/shared/lib/result';
import { and, eq } from 'drizzle-orm';
import { Hono } from 'hono';
import { todos } from '../../database/schema/todos';
import { todoSchema } from '../schemas/todo-schema';

export const todoApp = new Hono<CustomContext>()

todoApp.use('/*', protectWithSessionMiddleware);

// GET /todos
todoApp.get('/', async c => {
  const user = c.get('currentUser');

  const todosResult = await wrapAsyncInResult(
    db
      .select()
      .from(todos)
      .where(eq(todos.userId, user.id))
      .orderBy(todos.createdAt)
      .all(),
  );

  if (isFail(todosResult)) {
    log.error('Error fetching todos', { error: todosResult });
    return c.json(fail('Error fetching todos'), 500);
  }

  return c.json(ok(todosResult.value));
});

// POST /todos
todoApp.post('/', async c => {
  const user = c.get('currentUser');

  const body = await c.req.json();
  const validatedBody = todoSchema.safeParse(body);

  if (!validatedBody.success) {
    return c.json(fail('Invalid todo data'), 400);
  }

  const todoResult = await wrapAsyncInResult(
    db
      .insert(todos)
      .values({
        userId: user.id,
        ...validatedBody.data,
      })
      .returning()
      .get(),
  );

  if (isFail(todoResult)) {
    log.error('Error creating todo', { error: todoResult });
    return c.json(fail('Error creating todo'), 500);
  }

  return c.json(ok(todoResult.value));
});

// PUT /todos/:id
todoApp.put('/:id', async c => {
  const user = c.get('currentUser');

  const id = c.req.param('id');
  const body = await c.req.json();
  const validatedBody = todoSchema.safeParse(body);

  if (!validatedBody.success) {
    return c.json(fail('Invalid todo data'), 400);
  }

  const todoResult = await wrapAsyncInResult(
    db
      .update(todos)
      .set(validatedBody.data)
      .where(and(eq(todos.id, Number(id)), eq(todos.userId, user.id)))
      .returning()
      .get(),
  );

  if (isFail(todoResult)) {
    log.error('Error updating todo', { error: todoResult });
    return c.json(fail('Error updating todo'), 500);
  }

  return c.json(ok(todoResult.value));
});

// DELETE /todos/:id
todoApp.delete('/:id', async c => {
  const user = c.get('currentUser');
  const id = c.req.param('id');

  const todoResult = await wrapAsyncInResult(
    db
      .delete(todos)
      .where(and(eq(todos.id, Number(id)), eq(todos.userId, user.id)))
      .returning()
      .get(),
  );

  if (isFail(todoResult)) {
    log.error('Error deleting todo', { error: todoResult });
    return c.json(fail('Error deleting todo'), 500);
  }

  return c.json(ok(todoResult.value));
});


