import type { JSONContent } from '@tiptap/core';
import { type InferInsertModel, type InferSelectModel, relations, sql } from 'drizzle-orm';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { contentCommentTable } from './comment';
import { contentContributionTable } from './contribution';
import { topicTable } from './topic';
import { userTable } from './user';

export type ContentTable = InferSelectModel<typeof contentTable>;

export type NewContentTable = InferInsertModel<typeof contentTable>;

export const contentTable = sqliteTable('content', {
  id: integer('id').primaryKey().notNull(),
  title: text('title').notNull(),
  active: integer('active', { mode: 'boolean' }).notNull().default(true),
  contentType: text('content_type').$type<'image' | 'rich_text' | 'video' | 'file'>().notNull(),
  authorId: text('user_id')
    .notNull()
    .references(() => userTable.id, {
      onDelete: 'no action',
      onUpdate: 'cascade',
    }),
  topicId: integer('topic_id').references(() => topicTable.id, {
    onDelete: 'cascade',
    onUpdate: 'cascade',
  }),
  createdAt: text('created_at')
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: text('updated_at')
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});

export const contentTableRelations = relations(contentTable, ({ one, many }) => ({
  author: one(userTable, {
    fields: [contentTable.authorId],
    references: [userTable.id],
  }),
  contributors: many(contentContributionTable),
  comments: many(contentCommentTable),
  topic: one(topicTable, {
    fields: [contentTable.topicId],
    references: [topicTable.id],
  }),
}));

// IMAGE

export type ContentImageTable = InferSelectModel<typeof contentImageTable>;
export type NewContentImageTable = InferInsertModel<typeof contentImageTable>;

export const contentImageTable = sqliteTable('content_image', {
  id: integer('id').primaryKey().notNull(),
  contentId: integer('content_id')
    .notNull()
    .references(() => contentTable.id, {
      onDelete: 'cascade',
      onUpdate: 'cascade',
    }),
  src: text('stc').notNull(),
  description: text('description').notNull(),
  alt: text('alt').notNull(),
  createdAt: text('created_at')
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: text('updated_at')
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});

export const contentImageTableRelations = relations(contentImageTable, ({ one }) => ({
  content: one(contentTable, {
    fields: [contentImageTable.contentId],
    references: [contentTable.id],
  }),
}));

// RICH TEXT

export type ContentRichTextTable = InferSelectModel<typeof contentRichTextTable>;
export type NewContentRichTextTable = InferInsertModel<typeof contentRichTextTable>;

export const contentRichTextTable = sqliteTable('content_rich_text', {
  id: integer('id').primaryKey().notNull(),
  contentId: integer('content_id')
    .notNull()
    .references(() => contentTable.id, {
      onDelete: 'cascade',
      onUpdate: 'cascade',
    }),
  previewAsJson: text('preview_as_json', { mode: 'json' }).$type<JSONContent>().notNull(),
  asJson: text('as_json', { mode: 'json' }).$type<JSONContent>().notNull(),
  createdAt: text('created_at')
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: text('updated_at')
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});

export const contentRichTextTableRelations = relations(contentRichTextTable, ({ one }) => ({
  content: one(contentTable, {
    fields: [contentRichTextTable.contentId],
    references: [contentTable.id],
  }),
}));

// FILE

export type ContentFileTable = InferSelectModel<typeof contentFileTable>;
export type NewContentFileTable = InferInsertModel<typeof contentFileTable>;

export const contentFileTable = sqliteTable('content_file', {
  id: integer('id').primaryKey().notNull(),
  contentId: integer('content_id')
    .notNull()
    .references(() => contentTable.id, {
      onDelete: 'cascade',
      onUpdate: 'cascade',
    }),
  url: text('url').notNull(),
  filename: text('filename').notNull(),
  filesize: integer('filesize').notNull(),
  mimetype: text('mimetype').notNull(),
  visualDescription: text('visual_description').notNull(),
  createdAt: text('created_at')
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: text('updated_at')
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});

export const contentFileTableRelations = relations(contentFileTable, ({ one }) => ({
  content: one(contentTable, {
    fields: [contentFileTable.contentId],
    references: [contentTable.id],
  }),
}));

// VIDEO

export type ContentVideoTable = InferSelectModel<typeof contentVideoTable>;
export type NewContentVideoTable = InferInsertModel<typeof contentVideoTable>;

export const contentVideoTable = sqliteTable('content_video', {
  id: integer('id').primaryKey().notNull(),
  contentId: integer('content_id')
    .notNull()
    .references(() => contentTable.id, {
      onDelete: 'cascade',
      onUpdate: 'cascade',
    }),
  src: text('stc').notNull(),
  description: text('description').notNull(),
  alt: text('alt').notNull(),
  createdAt: text('created_at')
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: text('updated_at')
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});

export const contentVideoTableRelations = relations(contentVideoTable, ({ one }) => ({
  content: one(contentTable, {
    fields: [contentVideoTable.contentId],
    references: [contentTable.id],
  }),
}));
