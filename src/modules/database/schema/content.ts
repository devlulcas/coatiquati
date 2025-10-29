import { relations } from 'drizzle-orm';
import * as t from 'drizzle-orm/pg-core';
import type { ContentJSON } from '../../../modules/content/types/content-json-field';
import { tableTimestampColumns } from '../lib/helpers';
import { user } from './auth';
import { comments } from './comment';
import { votes } from './comment-vote';
import { reports } from './report';
import { topics } from './topic';

export type SelectContent = typeof contents.$inferSelect;
export type InsertContent = typeof contents.$inferInsert;

export enum ContentType {
  IMAGE = 1,
  RICH_TEXT = 2,
  VIDEO = 3,
}

export enum ContentStatus {
  DRAFT = 1,
  PUBLISHED = 2,
  ARCHIVED = 3,
}

export const contents = t.pgTable('content', {
  id: t.serial('id').primaryKey().notNull(),
  title: t.text('title').notNull(),
  contentType: t.smallint('content_type').$type<ContentType>().notNull(),
  status: t
    .smallint('status')
    .$type<ContentStatus>()
    .default(ContentStatus.DRAFT),
  content: t.jsonb('content').$type<ContentJSON>().notNull(),
  topicId: t.integer('topic_id').references(() => topics.id, {
    onDelete: 'cascade',
    onUpdate: 'cascade',
  }),
  userId: t
    .text('user_id')
    .notNull()
    .references(() => user.id, {
      onDelete: 'no action',
      onUpdate: 'cascade',
    }),
  ...tableTimestampColumns,
});

export const contentsRelations = relations(contents, ({ one, many }) => ({
  topic: one(topics, {
    fields: [contents.topicId],
    references: [topics.id],
  }),
  user: one(user, {
    fields: [contents.userId],
    references: [user.id],
  }),
  comments: many(comments),
  votes: many(votes),
  reports: many(reports),
}));
