import { relations, sql, type InferInsertModel, type InferSelectModel } from 'drizzle-orm';
import { foreignKey, integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { contentTable } from './content';
import { userTable } from './user';

export type ContentCommentTable = InferSelectModel<typeof contentCommentTable>;
export type ContentNewCommentTable = InferInsertModel<typeof contentCommentTable>;

export const contentCommentTable = sqliteTable(
  'comment',
  {
    id: integer('id').primaryKey().notNull(),
    contentId: integer('content_id')
      .notNull()
      .references(() => contentTable.id, {
        onDelete: 'cascade',
        onUpdate: 'cascade',
      }),
    authorId: text('user_id')
      .notNull()
      .references(() => userTable.id, {
        onDelete: 'cascade',
        onUpdate: 'cascade',
      }),
    content: text('content').notNull(),
    parentCommentId: integer('parent_comment_id'),
    upvotes: integer('upvotes').notNull().default(0),
    downvotes: integer('downvotes').notNull().default(0),
    edited: integer('edited', { mode: 'boolean' }).notNull().default(false),
    originalContent: text('original_content'),
    createdAt: text('created_at')
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: text('updated_at')
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    deletedAt: text('deleted_at'),
  },
  table => ({
    parentCommentReference: foreignKey(() => ({
      columns: [table.parentCommentId],
      foreignColumns: [table.id],
    })),
  }),
);

export const contentCommentTableRelations = relations(contentCommentTable, ({ one }) => ({
  content: one(contentTable, {
    fields: [contentCommentTable.contentId],
    references: [contentTable.id],
  }),
  author: one(userTable, {
    fields: [contentCommentTable.authorId],
    references: [userTable.id],
  }),
}));
