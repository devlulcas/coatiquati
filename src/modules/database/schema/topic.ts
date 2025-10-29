import { relations } from 'drizzle-orm';
import * as t from 'drizzle-orm/pg-core';
import { tableTimestampColumns } from '../lib/helpers';
import { user } from './auth';
import { comments } from './comment';
import { votes } from './comment-vote';
import { ContentStatus, contents } from './content';
import { reports } from './report';
import { trails } from './trail';

export type SelectTopic = typeof topics.$inferSelect;
export type InsertTopic = typeof topics.$inferInsert;

export const topics = t.pgTable('topic', {
  id: t.serial('id').primaryKey(),
  title: t.text('title').notNull(),
  description: t.text('description').notNull(),
  thumbnail: t.text('thumbnail'),
  status: t
    .smallint('status')
    .$type<ContentStatus>()
    .notNull()
    .default(ContentStatus.DRAFT),
  trailId: t
    .integer('trail_id')
    .notNull()
    .references(() => trails.id, {
      onDelete: 'cascade',
      onUpdate: 'cascade',
    }),
  userId: t.text('user_id').references(() => user.id, {
    onDelete: 'no action',
    onUpdate: 'cascade',
  }),
  ...tableTimestampColumns,
});

export const topicsRelations = relations(topics, ({ one, many }) => ({
  trail: one(trails, {
    fields: [topics.trailId],
    references: [trails.id],
  }),
  user: one(user, {
    fields: [topics.userId],
    references: [user.id],
  }),
  contents: many(contents),
  comments: many(comments),
  votes: many(votes),
  reports: many(reports),
}));
