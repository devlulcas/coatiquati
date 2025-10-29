import { pgTable, serial, text } from 'drizzle-orm/pg-core';
import { tableTimestampColumns } from '../lib/helpers';
import { user } from './auth';

export type SelectCategory = typeof categories.$inferSelect;
export type InsertCategory = typeof categories.$inferInsert;
export const categories = pgTable('category', {
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
