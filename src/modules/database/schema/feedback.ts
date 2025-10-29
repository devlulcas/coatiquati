import { relations } from 'drizzle-orm';
import { pgTable, serial, text } from 'drizzle-orm/pg-core';
import { tableTimestampColumns } from '../lib/helpers';
import { userTable } from './user';

export type FeedbackSelect = typeof feedbackTable.$inferSelect;
export type FeedbackInsert = typeof feedbackTable.$inferInsert;

export const feedbackTable = pgTable('feedback', {
  id: serial('id').primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => userTable.id),
  type: text('type').notNull().$type<'bug' | 'feature' | 'improvement'>(),
  content: text('content').notNull(),
  softwareVersion: text('software_version').notNull(),
  ...tableTimestampColumns,
});

export const feedbackTableRelations = relations(feedbackTable, ({ one }) => ({
  user: one(userTable, {
    fields: [feedbackTable.userId],
    references: [userTable.id],
  }),
}));
