import { pgTable, serial, text } from 'drizzle-orm/pg-core';
import { tableTimestampColumns } from '../lib/helpers';
import { user } from './auth';

export type SelectCategory = typeof category.$inferSelect;
export type InsertCategory = typeof category.$inferInsert;
export const category = pgTable('category', {
  id: serial('id').primaryKey().notNull(),
  name: text('name').primaryKey().notNull().unique(),
  authorId: text('user_id')
    .notNull()
    .references(() => user.id, {
      onDelete: 'set null',
      onUpdate: 'cascade',
    }),
  ...tableTimestampColumns,
});
