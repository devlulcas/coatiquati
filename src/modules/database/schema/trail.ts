import { relations } from 'drizzle-orm';
import * as t from 'drizzle-orm/pg-core';
import { tableTimestampColumns } from '../lib/helpers';
import { categories } from './category';
import { comments } from './comment';
import { votes } from './comment-vote';
import { ContentStatus } from './content';
import { contributions } from './contribution';
import { reports } from './report';
import { topics } from './topic';
import { trailSubscriptions } from './trail-subscription';
export type SelectTrail = typeof trails.$inferSelect;
export type InsertTrail = typeof trails.$inferInsert;

export const trails = t.pgTable('trail', {
  id: t.serial('id').primaryKey(),
  title: t.text('title').notNull(),
  description: t.text('description').notNull(),
  thumbnail: t.text('thumbnail').notNull(),
  status: t
    .smallint('status')
    .$type<ContentStatus>()
    .default(ContentStatus.DRAFT)
    .notNull(),
  categoryId: t
    .integer('category_id')
    .references(() => categories.id, {
      onDelete: 'set null',
      onUpdate: 'cascade',
    })
    .notNull(),
  ...tableTimestampColumns,
});

export const trailsRelations = relations(trails, ({ one, many }) => ({
  category: one(categories, {
    fields: [trails.categoryId],
    references: [categories.id],
  }),
  topics: many(topics),
  subscriptions: many(trailSubscriptions),
  contributions: many(contributions),
  comments: many(comments),
  votes: many(votes),
  reports: many(reports),
}));
