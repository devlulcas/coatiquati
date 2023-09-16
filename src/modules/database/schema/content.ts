import type { JSONContent } from '@tiptap/core';
import {
  relations,
  sql,
  type InferInsertModel,
  type InferSelectModel,
} from 'drizzle-orm';
import { blob, integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { commentTable } from './comment';
import { contributionTable } from './contribution';
import { topicTable } from './topic';
import { userTable } from './user';

export type ContentTable = InferSelectModel<typeof contentTable>;

export type NewContentTable = InferInsertModel<typeof contentTable>;

export const contentTable = sqliteTable('content', {
  id: integer('id').primaryKey().notNull(),
  title: text('title').notNull(),
  active: integer('active', { mode: 'boolean' }).notNull().default(true),
  contentType: text('content_type')
    .$type<'image' | 'rich_text' | 'video' | 'file'>()
    .notNull(),
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

export const contentTableRelations = relations(
  contentTable,
  ({ one, many }) => ({
    author: one(userTable, {
      fields: [contentTable.authorId],
      references: [userTable.id],
    }),
    contributors: many(contributionTable),
    comments: many(commentTable),
    topic: one(contentTable, {
      fields: [contentTable.topicId],
      references: [contentTable.id],
    }),
  })
);

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

export type ContentRichTextTable = InferSelectModel<
  typeof contentRichTextTable
>;
export type NewContentRichTextTable = InferInsertModel<
  typeof contentRichTextTable
>;

export const contentRichTextTable = sqliteTable('content_rich_text', {
  id: integer('id').primaryKey().notNull(),
  contentId: integer('content_id')
    .notNull()
    .references(() => contentTable.id, {
      onDelete: 'cascade',
      onUpdate: 'cascade',
    }),
  previewAsJson: blob('preview_as_json').$type<JSONContent>().notNull(),
  asJson: blob('as_json').$type<JSONContent>().notNull(),
  createdAt: text('created_at')
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: text('updated_at')
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});

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
