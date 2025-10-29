import { relations } from 'drizzle-orm';
import * as t from 'drizzle-orm/pg-core';
import packageJson from '../../../../package.json';
import { tableTimestampColumns } from '../lib/helpers';
import { user } from './auth';
import { feedbackResponses } from './feedback-response';

export type SelectFeedback = typeof feedbacks.$inferSelect;
export type InsertFeedback = typeof feedbacks.$inferInsert;

export enum FeedbackType {
  BUG = 1,
  FEATURE = 2,
  IMPROVEMENT = 3,
}

export enum FeedbackStatus {
  PENDING_REVIEW = 1,
  REVIEWED = 2,
  REJECTED = 3,
  ARCHIVED = 4,
}

export const feedbacks = t.pgTable('feedback', {
  id: t.serial('id').primaryKey(),
  userId: t
    .text('user_id')
    .notNull()
    .references(() => user.id, {
      onDelete: 'cascade',
      onUpdate: 'cascade',
    }),
  type: t.smallint('type').notNull().$type<FeedbackType>(),
  status: t
    .smallint('status')
    .notNull()
    .$type<FeedbackStatus>()
    .default(FeedbackStatus.PENDING_REVIEW),
  content: t.text('content').notNull(),
  softwareVersion: t
    .text('software_version')
    .notNull()
    .default(packageJson.version),
  ...tableTimestampColumns,
});

export const feedbacksRelations = relations(feedbacks, ({ one, many }) => ({
  user: one(user, {
    fields: [feedbacks.userId],
    references: [user.id],
  }),
  responses: many(feedbackResponses),
}));
