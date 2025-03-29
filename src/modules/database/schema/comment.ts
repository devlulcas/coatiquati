import { type InferInsertModel, type InferSelectModel } from 'drizzle-orm';
import { foreignKey, integer, sqliteTable, text, uniqueIndex } from 'drizzle-orm/sqlite-core';
import { tableTimestampColumns } from '../lib/helpers';
import { contentTable } from './content';
import { userTable } from './user';

export type Comment = InferSelectModel<typeof commentTable>;
export type NewComment = InferInsertModel<typeof commentTable>;

export const commentTable = sqliteTable(
  'comment',
  {
    id: integer('id').primaryKey().notNull(),
    contentId: integer('content_id')
      .notNull()
      .references(() => contentTable.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
    authorId: text('author_id')
      .notNull()
      .references(() => userTable.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
    content: text('content').notNull(),
    parentCommentId: integer('parent_comment_id'),

    // Métricas
    voteCount: integer('vote_count').notNull().default(0),
    replyCount: integer('reply_count').notNull().default(0),
    isEdited: integer('is_edited', { mode: 'boolean' }).notNull().default(false),
    ...tableTimestampColumns,
  },
  table => ({
    // Chaves estrangeira para si mesmo
    parentCommentReference: foreignKey({
      columns: [table.parentCommentId],
      foreignColumns: [table.id],
    }),
    // Indices para buscas frequentes
    contentIdIdx: uniqueIndex('content_id_idx').on(table.contentId),
    authorIdIdx: uniqueIndex('author_id_idx').on(table.authorId),
  }),
);

export type CommentVote = InferSelectModel<typeof commentVoteTable>;
export type NewCommentVote = InferInsertModel<typeof commentVoteTable>;

export const commentVoteTable = sqliteTable(
  'comment_vote',
  {
    id: integer('id').primaryKey().notNull(),
    commentId: integer('comment_id')
      .notNull()
      .references(() => commentTable.id, {
        onDelete: 'cascade',
        onUpdate: 'cascade',
      }),
    userId: text('user_id')
      .notNull()
      .references(() => userTable.id, {
        onDelete: 'cascade',
        onUpdate: 'cascade',
      }),
    // -1 | 1
    value: integer('value').notNull().default(1),
    ...tableTimestampColumns,
  },
  table => ({
    userCommentUnique: uniqueIndex('user_comment_unique_idx').on(table.userId, table.commentId),
  }),
);
