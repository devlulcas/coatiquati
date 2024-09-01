import { relations, type InferInsertModel, type InferSelectModel } from 'drizzle-orm';
import { foreignKey, integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { tableTimestampColumns } from '../lib/helpers';
import { contentTable } from './content';
import { userTable } from './user';

export type ContentCommentTable = InferSelectModel<typeof contentCommentTable>;
export type ContentNewCommentTable = InferInsertModel<typeof contentCommentTable>;

export const contentCommentTable = sqliteTable(
  'comment',
  {
    id: integer('id').primaryKey().notNull(),
    contentId: integer('contentId')
      .notNull()
      .references(() => contentTable.id, {
        onDelete: 'cascade',
        onUpdate: 'cascade',
      }),
    authorId: text('useId')
      .notNull()
      .references(() => userTable.id, {
        onDelete: 'cascade',
        onUpdate: 'cascade',
      }),
    content: text('content').notNull(),
    parentCommentId: integer('parentCommentId'),
    ...tableTimestampColumns,
  },
  table => ({
    parentCommentReference: foreignKey(() => ({
      columns: [table.parentCommentId],
      foreignColumns: [table.id],
    })),
  }),
);
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
  votes: many(commentVoteTable),
}));

export const commentVoteTable = sqliteTable('commentVote', {
  id: integer('id').primaryKey().notNull(),
  commentId: integer('commenId')
    .notNull()
    .references(() => contentCommentTable.id, {
      onDelete: 'cascade',
      onUpdate: 'cascade',
    }),
  userId: text('useId')
    .notNull()
    .references(() => userTable.id, {
      onDelete: 'cascade',
      onUpdate: 'cascade',
    }),
  vote: integer('vote').notNull(),
  ...tableTimestampColumns,
});
export const commentVoteTableRelations = relations(commentVoteTable, ({ one }) => ({
  comment: one(contentCommentTable, {
    fields: [commentVoteTable.commentId],
    references: [contentCommentTable.id],
  }),
  user: one(userTable, {
    fields: [commentVoteTable.userId],
    references: [userTable.id],
  }),
}));
