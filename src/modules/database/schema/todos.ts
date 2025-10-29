import type { InferInsertModel, InferSelectModel } from 'drizzle-orm';
import { boolean, pgTable, serial, text } from 'drizzle-orm/pg-core';
import { tableTimestampColumns } from '../lib/helpers';
import { userTable } from './user';

export type TodoSelect = InferSelectModel<typeof todos>;
export type TodoInsert = InferInsertModel<typeof todos>;

export const todos = pgTable('todos', {
  id: serial('id').primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => userTable.id),
  text: text('text').notNull(),
  completed: boolean('completed').notNull().default(false),
  ...tableTimestampColumns,
});
