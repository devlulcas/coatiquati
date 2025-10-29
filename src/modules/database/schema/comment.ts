import { relations, sql } from 'drizzle-orm';
import * as t from 'drizzle-orm/pg-core';
import { tableTimestampColumns } from '../lib/helpers';
import { user } from './auth';
import { votes } from './comment-vote';
import { contents } from './content';
import { publications } from './publication';
import { reports } from './report';
import { topics } from './topic';
import { trails } from './trail';

export type SelectComment = typeof comments.$inferSelect;
export type InsertComment = typeof comments.$inferInsert;

const onlyOneTargetCheck = sql`(
  (trail_id IS NOT NULL)::int +
  (topic_id IS NOT NULL)::int +
  (content_id IS NOT NULL)::int +
  (publication_id IS NOT NULL)::int
) = 1`;

export const comments = t.pgTable(
  'comment',
  {
    id: t.serial('id').primaryKey(),
    userId: t
      .text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
    content: t.text('content').notNull(),

    // Parent comment (null for root comments)
    parentCommentId: t.integer('parent_comment_id'),

    // Targets
    trailId: t.integer('trail_id').references(() => trails.id, {
      onDelete: 'cascade',
      onUpdate: 'cascade',
    }),
    topicId: t.integer('topic_id').references(() => topics.id, {
      onDelete: 'cascade',
      onUpdate: 'cascade',
    }),
    contentId: t.integer('content_id').references(() => contents.id, {
      onDelete: 'cascade',
      onUpdate: 'cascade',
    }),
    publicationId: t
      .integer('publication_id')
      .references(() => publications.id, {
        onDelete: 'cascade',
        onUpdate: 'cascade',
      }),

    // Metrics
    voteCount: t.integer('vote_count').notNull().default(0),
    ...tableTimestampColumns,
  },
  (table) => [
    t.foreignKey({
      name: 'comment_parent_comment_id_fkey',
      columns: [table.parentCommentId],
      foreignColumns: [table.id],
    }),
    t
      .uniqueIndex('user_comment_target_unique_idx')
      .on(
        table.userId,
        table.trailId,
        table.topicId,
        table.contentId,
        table.publicationId
      ),
    t.check('only_one_target_check', onlyOneTargetCheck),
  ]
);

export const commentsRelations = relations(comments, ({ one, many }) => ({
  user: one(user, {
    fields: [comments.userId],
    references: [user.id],
  }),
  parent: one(comments, {
    fields: [comments.parentCommentId],
    references: [comments.id],
    relationName: 'parent_comment',
  }),
  replies: many(comments),
  trail: one(trails, {
    fields: [comments.trailId],
    references: [trails.id],
    relationName: 'trail_comment',
  }),
  topic: one(topics, {
    fields: [comments.topicId],
    references: [topics.id],
    relationName: 'topic_comment',
  }),
  publication: one(publications, {
    fields: [comments.publicationId],
    references: [publications.id],
    relationName: 'publication_comment',
  }),
  votes: many(votes),
  reports: many(reports),
}));
