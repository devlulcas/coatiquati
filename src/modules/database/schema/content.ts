import type { JSONContent } from '@tiptap/core';
import { relations } from 'drizzle-orm';
import * as t from 'drizzle-orm/pg-core';
import { ContentStatus } from '../lib/content-enum';
import { tableTimestampColumns } from '../lib/helpers';
import { user } from './auth';
import { comments } from './comment';
import { contributions } from './contribution';
import { reports } from './report';
import { topics } from './topic';
import { votes } from './vote';

export type SelectContent = typeof contents.$inferSelect;
export type InsertContent = typeof contents.$inferInsert;

export const contents = t.pgTable('content', {
  id: t.serial('id').primaryKey().notNull(),
  title: t.text('title').notNull(),
  description: t.text('description'),
  status: t.smallint('status').$type<ContentStatus>().notNull().default(ContentStatus.DRAFT),
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
  richTextContent: one(richTextContents, {
    fields: [contents.id],
    references: [richTextContents.contentId],
  }),
  imageContent: one(imageContents, {
    fields: [contents.id],
    references: [imageContents.contentId],
  }),
  videoContent: one(videoContents, {
    fields: [contents.id],
    references: [videoContents.contentId],
  }),
  contributions: many(contributions),
}));

// rich text content
export type SelectRichTextContent = typeof richTextContents.$inferSelect;
export type InsertRichTextContent = typeof richTextContents.$inferInsert;

export const richTextContents = t.pgTable('rich_text_content', {
  id: t.serial('id').primaryKey().notNull(),
  contentId: t
    .integer('content_id')
    .references(() => contents.id)
    .notNull(),
  jsonContent: t.jsonb('json_content').$type<JSONContent>().notNull(),
  ...tableTimestampColumns,
});

// image content
export type SelectImageContent = typeof imageContents.$inferSelect;
export type InsertImageContent = typeof imageContents.$inferInsert;

export const imageContents = t.pgTable('image_content', {
  id: t.serial('id').primaryKey().notNull(),
  contentId: t
    .integer('content_id')
    .references(() => contents.id)
    .notNull(),
  src: t.text('src').notNull(),
  alt: t.text('alt').notNull(),
  ...tableTimestampColumns,
});

// video content
export type SelectVideoContent = typeof videoContents.$inferSelect;
export type InsertVideoContent = typeof videoContents.$inferInsert;

export const videoContents = t.pgTable('video_content', {
  id: t.serial('id').primaryKey().notNull(),
  contentId: t
    .integer('content_id')
    .references(() => contents.id)
    .notNull(),
  src: t.text('src').notNull(),
  ...tableTimestampColumns,
});
