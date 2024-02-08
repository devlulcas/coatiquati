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
    createdAt: text('created_at')
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: text('updated_at')
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    deletedAt: text('deleted_at').default(sql`CURRENT_TIMESTAMP`),
  },
  table => ({
    parentCommentReference: foreignKey(() => ({
      columns: [table.parentCommentId],
      foreignColumns: [table.id],
    })),
  }),
);

export const contentCommentVotingTable = sqliteTable('content_comment_voting', {
  id: integer('id').primaryKey().notNull(),
  commentId: integer('comment_id')
    .notNull()
    .references(() => contentCommentTable.id, {
      onDelete: 'cascade',
      onUpdate: 'cascade',
    }),
  userId: text('user_id')
    .notNull()
    .references(() => userTable.id, {
      onDelete: 'cascade',
      onUpdate: 'cascade',
    }),
  vote: integer('vote').notNull(),
  createdAt: text('created_at')
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: text('updated_at')
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});

export const contentCommentVotingTableRelations = relations(contentCommentVotingTable, ({ one }) => ({
  comment: one(contentCommentTable, {
    fields: [contentCommentVotingTable.commentId],
    references: [contentCommentTable.id],
  }),
  user: one(userTable, {
    fields: [contentCommentVotingTable.userId],
    references: [userTable.id],
  }),
}));

export const contentCommentTableRelations = relations(contentCommentTable, ({ one, many }) => ({
  content: one(contentTable, {
    fields: [contentCommentTable.contentId],
    references: [contentTable.id],
  }),
  author: one(userTable, {
    fields: [contentCommentTable.authorId],
    references: [userTable.id],
  }),
  parentComment: one(contentCommentTable, {
    fields: [contentCommentTable.parentCommentId],
    references: [contentCommentTable.id],
  }),
  votes: many(contentCommentVotingTable),
}));
