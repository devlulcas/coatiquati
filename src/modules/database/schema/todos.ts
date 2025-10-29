import { relations } from 'drizzle-orm';
import { boolean, pgTable, serial, text } from 'drizzle-orm/pg-core';
import { tableTimestampColumns } from '../lib/helpers';
import { user } from './auth';

export type SelectTodo = typeof todos.$inferSelect;
export type InsertTodo = typeof todos.$inferInsert;

export const todos = pgTable('todo', {
  id: serial('id').primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => user.id),
  text: text('text').notNull(),
  completed: boolean('completed').notNull().default(false),
  ...tableTimestampColumns,
});

export const todosRelations = relations(todos, ({ one }) => ({
  user: one(user, {
    fields: [todos.userId],
    references: [user.id],
  }),
}));
