import { relations } from 'drizzle-orm';
import * as t from 'drizzle-orm/pg-core';
import { tableTimestampColumns } from '../lib/helpers';
import { type ReportReason, ReportStatus } from '../lib/report-enum';
import { user } from './auth';
import { comments } from './comment';
import { contents } from './content';
import { publications } from './publication';
import { topics } from './topic';
import { trails } from './trail';

export type SelectReport = typeof reports.$inferSelect;
export type InsertReport = typeof reports.$inferInsert;

export const reports = t.pgTable('report', {
  id: t.serial('id').primaryKey(),
  reportedById: t
    .text('reported_by_id')
    .notNull()
    .references(() => user.id, {
      onDelete: 'cascade',
      onUpdate: 'cascade',
    }),
  type: t.smallint('type').$type<ReportReason>().notNull(),
  description: t.text('description').notNull(),
  status: t.smallint('status').$type<ReportStatus>().notNull().default(ReportStatus.PENDING),
  moderatorId: t.text('moderator_id').references(() => user.id, {
    onDelete: 'cascade',
    onUpdate: 'cascade',
  }),

  // Reported user
  userId: t
    .text('user_id')
    .notNull()
    .references(() => user.id, {
      onDelete: 'no action',
      onUpdate: 'cascade',
    }),

  // Target
  trailId: t.integer('trail_id').references(() => trails.id, {
    onDelete: 'no action',
    onUpdate: 'cascade',
  }),
  topicId: t.integer('topic_id').references(() => topics.id, {
    onDelete: 'no action',
    onUpdate: 'cascade',
  }),
  contentId: t.integer('content_id').references(() => contents.id, {
    onDelete: 'no action',
    onUpdate: 'cascade',
  }),
  publicationId: t.integer('publication_id').references(() => publications.id, {
    onDelete: 'no action',
    onUpdate: 'cascade',
  }),
  commentId: t.integer('comment_id').references(() => comments.id, {
    onDelete: 'no action',
    onUpdate: 'cascade',
  }),
  ...tableTimestampColumns,
});

export const reportsRelations = relations(reports, ({ one }) => ({
  reportedBy: one(user, {
    fields: [reports.reportedById],
    references: [user.id],
  }),
  moderator: one(user, {
    fields: [reports.moderatorId],
    references: [user.id],
  }),
  reportedUser: one(user, {
    fields: [reports.userId],
    references: [user.id],
  }),
  reportedTrail: one(trails, {
    fields: [reports.trailId],
    references: [trails.id],
  }),
  reportedTopic: one(topics, {
    fields: [reports.topicId],
    references: [topics.id],
  }),
  reportedContent: one(contents, {
    fields: [reports.contentId],
    references: [contents.id],
  }),
  reportedPublication: one(publications, {
    fields: [reports.publicationId],
    references: [publications.id],
  }),
  reportedComment: one(comments, {
    fields: [reports.commentId],
    references: [comments.id],
  }),
}));
