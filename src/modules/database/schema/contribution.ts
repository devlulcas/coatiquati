import { relations, sql } from 'drizzle-orm';
import * as t from 'drizzle-orm/pg-core';
import { tableTimestampColumns } from '../lib/helpers';
import { user } from './auth';
import { contents } from './content';
import { topics } from './topic';
import { trails } from './trail';

export type SelectContribution = typeof contributions.$inferSelect;
export type InsertContribution = typeof contributions.$inferInsert;

const onlyOneTargetCheck = sql`(
  (trail_id IS NOT NULL)::int +
  (topic_id IS NOT NULL)::int +
  (content_id IS NOT NULL)::int
) = 1`;

export const contributions = t.pgTable(
  'contribution',
  {
    id: t.serial('id').primaryKey().notNull(),
    userId: t
      .text('user_id')
      .references(() => user.id)
      .notNull(),
    trailId: t.integer('trail_id').references(() => trails.id),
    topicId: t.integer('topic_id').references(() => topics.id),
    contentId: t.integer('content_id').references(() => contents.id),
    ...tableTimestampColumns,
  },
  () => [t.check('only_one_target_check', onlyOneTargetCheck)]
);

export const contributionsRelations = relations(contributions, ({ one }) => ({
  user: one(user, {
    fields: [contributions.userId],
    references: [user.id],
  }),
  trail: one(trails, {
    fields: [contributions.trailId],
    references: [trails.id],
  }),
  topic: one(topics, {
    fields: [contributions.topicId],
    references: [topics.id],
  }),
  content: one(contents, {
    fields: [contributions.contentId],
    references: [contents.id],
  }),
}));
