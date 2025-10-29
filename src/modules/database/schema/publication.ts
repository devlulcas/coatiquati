import { pgTable, serial, text } from 'drizzle-orm/pg-core';
import { tableTimestampColumns } from '../lib/helpers';
import { user } from './auth';

export type SelectPublication = typeof publications.$inferSelect;
export type InsertPublication = typeof publications.$inferInsert;
export const publications = pgTable('publication', {
  id: serial('id').primaryKey(),
  content: text('content').notNull(),
  authorId: text('author_id')
    .notNull()
    .references(() => user.id, {
      onDelete: 'no action',
      onUpdate: 'cascade',
    }),
  ...tableTimestampColumns,
});
