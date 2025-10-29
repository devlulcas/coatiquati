import { boolean, pgTable, serial, text } from 'drizzle-orm/pg-core';
import { tableTimestampColumns } from '../lib/helpers';
import { userTable } from './user';

export type TodoSelect = typeof todos.$inferSelect;
export type TodoInsert = typeof todos.$inferInsert;

export const todos = pgTable('todos', {
  id: serial('id').primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => userTable.id),
  text: text('text').notNull(),
  completed: boolean('completed').notNull().default(false),
  ...tableTimestampColumns,
});
