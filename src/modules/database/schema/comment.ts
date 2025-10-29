import {
  boolean,
  foreignKey,
  integer,
  pgTable,
  serial,
  text,
  uniqueIndex,
} from 'drizzle-orm/pg-core';
import { tableTimestampColumns } from '../lib/helpers';
import { user } from './auth';
import { content } from './content';

export type SelectComment = typeof comment.$inferSelect;
export type InsertComment = typeof comment.$inferInsert;
export const comment = pgTable(
  'comment',
  {
    id: serial('id').primaryKey().notNull(),
    contentId: integer('content_id')
      .notNull()
      .references(() => content.id, {
        onDelete: 'cascade',
        onUpdate: 'cascade',
      }),
    authorId: text('author_id')
      .notNull()
      .references(() => user.id, {
        onDelete: 'cascade',
        onUpdate: 'cascade',
      }),
    content: text('content').notNull(),
    parentCommentId: integer('parent_comment_id'),

    // Métricas
    voteCount: integer('vote_count').notNull().default(0),
    replyCount: integer('reply_count').notNull().default(0),
    isEdited: boolean('is_edited').notNull().default(false),
    ...tableTimestampColumns,
  },
  (table) => [
    // Chaves estrangeira para si mesmo
    foreignKey({
      columns: [table.parentCommentId],
      foreignColumns: [table.id],
    }),
    // Indices para buscas frequentes
    uniqueIndex('content_id_idx').on(table.contentId),
    uniqueIndex('author_id_idx').on(table.authorId),
  ]
);

export type SelectCommentVote = typeof commentVote.$inferSelect;
export type InsertCommentVote = typeof commentVote.$inferInsert;
export const commentVote = pgTable(
  'comment_vote',
  {
    id: serial('id').primaryKey().notNull(),
    commentId: integer('comment_id')
      .notNull()
      .references(() => comment.id, {
        onDelete: 'cascade',
        onUpdate: 'cascade',
      }),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, {
        onDelete: 'cascade',
        onUpdate: 'cascade',
      }),
    // -1 | 1
    value: integer('value').notNull().default(1),
    ...tableTimestampColumns,
  },
  (table) => [
    uniqueIndex('user_comment_unique_idx').on(table.userId, table.commentId),
  ]
);
