import { relations, type InferInsertModel, type InferSelectModel } from 'drizzle-orm';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { tableTimestampColumns } from '../lib/helpers';
import { userTable } from './user';

export type Feedback = InferSelectModel<typeof feedbackTable>;
export type NewFeedback = InferInsertModel<typeof feedbackTable>;

export const feedbackTable = sqliteTable('feedback', {
  id: integer('id').primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => userTable.id),
  type: text('type').notNull().$type<'bug' | 'feature' | 'improvement'>(),
  content: text('content', { mode: 'json' }).$type<string>().notNull(),
  softwareVersion: text('software_version').notNull(),
  ...tableTimestampColumns
});

export const feedbackTableRelations = relations(feedbackTable, ({ one }) => ({
  user: one(userTable, {
    fields: [feedbackTable.userId],
    references: [userTable.id],
  }),
}));
