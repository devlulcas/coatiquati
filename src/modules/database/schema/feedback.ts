import { pgTable, serial, text } from 'drizzle-orm/pg-core';
import { tableTimestampColumns } from '../lib/helpers';
import { user } from './auth';

export type SelectFeedback = typeof feedback.$inferSelect;
export type InsertFeedback = typeof feedback.$inferInsert;
export const feedback = pgTable('feedback', {
  id: serial('id').primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => user.id),
  type: text('type').notNull().$type<'bug' | 'feature' | 'improvement'>(),
  content: text('content').notNull(),
  softwareVersion: text('software_version').notNull(),
  ...tableTimestampColumns,
});
