import {
  relations,
  sql,
  type InferInsertModel,
  type InferSelectModel,
} from 'drizzle-orm';
import {
  foreignKey,
  integer,
  sqliteTable,
  text,
} from 'drizzle-orm/sqlite-core';
import { userTable } from './user';

export type CommentTable = InferSelectModel<typeof commentTable>;
export type NewCommentTable = InferInsertModel<typeof commentTable>;

export const commentTable = sqliteTable(
  'comment',
  {
    id: integer('id').primaryKey().notNull(),
    entityId: integer('content_id').notNull(),
    entityType: text('entity_type')
      .$type<'trail' | 'topic' | 'content'>()
      .notNull(),
    authorId: text('user_id')
      .notNull()
      .references(() => userTable.id, {
        onDelete: 'cascade',
        onUpdate: 'cascade',
      }),
    content: text('content').notNull(),
    upvotes: integer('upvotes').notNull().default(0),
    downvotes: integer('downvotes').notNull().default(0),
    replyTo: integer('reply_to'),
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
  (table) => ({
    parentReference: foreignKey(() => ({
      columns: [table.replyTo],
      foreignColumns: [table.id],
    })),
  })
);

export const commentTableRelations = relations(
  commentTable,
  ({ one, many }) => ({
    author: one(userTable, {
      fields: [commentTable.authorId],
      references: [userTable.id],
    }),
    replies: many(commentTable),
  })
);
