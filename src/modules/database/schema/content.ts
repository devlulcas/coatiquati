import { sql, type InferModel } from 'drizzle-orm';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { userTable } from './user';

export type ContentTable = InferModel<typeof contentTable, 'select'>;

export type NewContentTable = InferModel<typeof contentTable, 'insert'>;

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

export type ContentImageTable = InferModel<typeof contentImageTable, 'select'>;
export type NewContentImageTable = InferModel<
  typeof contentImageTable,
  'insert'
>;

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

export type ContentHtmlTable = InferModel<typeof contentHtmlTable, 'select'>;
export type NewContentHtmlTable = InferModel<typeof contentHtmlTable, 'insert'>;

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

export type ContentFileTable = InferModel<typeof contentFileTable, 'select'>;
export type NewContentFileTable = InferModel<typeof contentFileTable, 'insert'>;

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
