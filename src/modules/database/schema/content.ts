import {
  relations,
  sql,
  type InferInsertModel,
  type InferSelectModel,
} from 'drizzle-orm';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { commentTable } from './comment';
import { contributionTable } from './contribution';
import { userTable } from './user';

export type ContentTable = InferSelectModel<typeof contentTable>;

export type NewContentTable = InferInsertModel<typeof contentTable>;

export const contentTable = sqliteTable('content', {
  id: integer('id').primaryKey().notNull(),
  title: text('title').notNull(),
  active: integer('active', { mode: 'boolean' }).notNull().default(true),
  contentType: text('content_type')
    .$type<'image' | 'html' | 'file'>()
    .notNull(),
  authorId: text('user_id')
    .notNull()
    .references(() => userTable.id, {
      onDelete: 'no action',
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
  url: text('url').notNull(),
  visualDescription: text('visual_description').notNull(),
  createdAt: text('created_at')
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: text('updated_at')
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});

export type ContentHtmlTable = InferSelectModel<typeof contentHtmlTable>;
export type NewContentHtmlTable = InferInsertModel<typeof contentHtmlTable>;

export const contentHtmlTable = sqliteTable('content_html', {
  id: integer('id').primaryKey().notNull(),
  contentId: integer('content_id')
    .notNull()
    .references(() => contentTable.id, {
      onDelete: 'cascade',
      onUpdate: 'cascade',
    }),
  html: text('html').notNull(),
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
