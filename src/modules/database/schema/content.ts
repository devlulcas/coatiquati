import type { JSONContent } from '@tiptap/core';
import { relations, type InferInsertModel, type InferSelectModel } from 'drizzle-orm';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { tableTimestampColumns } from '../lib/helpers';
import { contentContributionTable } from './contribution';
import { topicTable } from './topic';
import { userTable } from './user';

// BASE
export type ContentSelect = InferSelectModel<typeof contentTable>;
export type ContentInsert = InferInsertModel<typeof contentTable>;
export const contentTable = sqliteTable('content', {
  id: integer('id').primaryKey().notNull(),
  title: text('title').notNull(),
  active: integer('active', { mode: 'boolean' }).notNull().default(true),
  topicId: integer('topic_id').references(() => topicTable.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
  authorId: text('user_id')
    .notNull()
    .references(() => userTable.id, { onDelete: 'no action', onUpdate: 'cascade' }),
  ...tableTimestampColumns,
});
export const contentTableRelations = relations(contentTable, ({ one, many }) => ({
  topic: one(topicTable, {
    fields: [contentTable.topicId],
    references: [topicTable.id],
  }),
  author: one(userTable, {
    fields: [contentTable.authorId],
    references: [userTable.id],
  }),
  contributors: many(contentContributionTable),
  image: one(contentImageTable, {
    fields: [contentTable.id],
    references: [contentImageTable.baseContentId],
  }),
  richText: one(contentRichTextTable, {
    fields: [contentTable.id],
    references: [contentRichTextTable.baseContentId],
  }),
  video: one(contentVideoTable, {
    fields: [contentTable.id],
    references: [contentVideoTable.baseContentId],
  }),
}));

// IMAGE
export type ContentImageSelect = InferSelectModel<typeof contentImageTable>;
export type ContentImageInsert = InferInsertModel<typeof contentImageTable>;
export const contentImageTable = sqliteTable('content_image', {
  contentType: text('content_type').notNull().default('image').$type<'image'>(),
  src: text('stc').notNull(),
  description: text('description').notNull(),
  id: integer('id').primaryKey().notNull(),
  baseContentId: integer('base_content_id')
    .notNull()
    .references(() => contentTable.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
  ...tableTimestampColumns,
});
export const contentImageTableRelations = relations(contentImageTable, ({ one }) => ({
  content: one(contentTable, {
    fields: [contentImageTable.baseContentId],
    references: [contentTable.id],
  }),
}));

// RICH TEXT
export type ContentRichTextSelect = InferSelectModel<typeof contentRichTextTable>;
export type ContentRichTextInsert = InferInsertModel<typeof contentRichTextTable>;
export const contentRichTextTable = sqliteTable('content_rich_text', {
  contentType: text('content_type').notNull().default('rich_text').$type<'rich_text'>(),
  previewAsJson: text('preview_as_json', { mode: 'json' }).$type<JSONContent>().notNull(),
  asJson: text('as_json', { mode: 'json' }).$type<JSONContent>().notNull(),
  id: integer('id').primaryKey().notNull(),
  baseContentId: integer('base_content_id')
    .notNull()
    .references(() => contentTable.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
  ...tableTimestampColumns,
});
export const contentRichTextTableRelations = relations(contentRichTextTable, ({ one }) => ({
  content: one(contentTable, {
    fields: [contentRichTextTable.baseContentId],
    references: [contentTable.id],
  }),
}));

// VIDEO
export type ContentVideoSelect = InferSelectModel<typeof contentVideoTable>;
export type ContentVideoInsert = InferInsertModel<typeof contentVideoTable>;
export const contentVideoTable = sqliteTable('content_video', {
  contentType: text('content_type').notNull().default('video').$type<'video'>(),
  src: text('stc').notNull(),
  description: text('description').notNull(),
  id: integer('id').primaryKey().notNull(),
  baseContentId: integer('base_content_id')
    .notNull()
    .references(() => contentTable.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
  ...tableTimestampColumns,
});
export const contentVideoTableRelations = relations(contentVideoTable, ({ one }) => ({
  content: one(contentTable, {
    fields: [contentVideoTable.baseContentId],
    references: [contentTable.id],
  }),
}));
