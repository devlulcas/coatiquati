import { relations } from 'drizzle-orm';
import * as t from 'drizzle-orm/pg-core';
import { tableTimestampColumns } from '../lib/helpers';
import { user } from './auth';
import { feedbacks } from './feedback';

export type SelectFeedbackResponse = typeof feedbackResponses.$inferSelect;
export type InsertFeedbackResponse = typeof feedbackResponses.$inferInsert;

export const feedbackResponses = t.pgTable('feedback_response', {
  id: t.serial('id').primaryKey(),
  feedbackId: t
    .integer('feedback_id')
    .notNull()
    .references(() => feedbacks.id, {
      onDelete: 'cascade',
      onUpdate: 'cascade',
    }),
  userId: t
    .text('user_id')
    .notNull()
    .references(() => user.id, {
      onDelete: 'cascade',
      onUpdate: 'cascade',
    }),
  content: t.text('content').notNull(),
  ...tableTimestampColumns,
});

export const feedbackResponsesRelations = relations(
  feedbackResponses,
  ({ one }) => ({
    user: one(user, {
      fields: [feedbackResponses.userId],
      references: [user.id],
    }),
    feedback: one(feedbacks, {
      fields: [feedbackResponses.feedbackId],
      references: [feedbacks.id],
    }),
  })
);
