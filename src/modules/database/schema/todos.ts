import { boolean, pgTable, serial, text } from 'drizzle-orm/pg-core';
import { tableTimestampColumns } from '../lib/helpers';
import { user } from './auth';

export type SelectTodo = typeof todo.$inferSelect;
export type InsertTodo = typeof todo.$inferInsert;
export const todo = pgTable('todos', {
  id: serial('id').primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => user.id),
  text: text('text').notNull(),
  completed: boolean('completed').notNull().default(false),
  ...tableTimestampColumns,
});
