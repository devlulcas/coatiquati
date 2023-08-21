import { sql, type InferModel } from 'drizzle-orm';
import {
  integer,
  primaryKey,
  sqliteTable,
  text,
} from 'drizzle-orm/sqlite-core';
import { userTable } from './user';

export type CommentTable = InferModel<typeof commentTable, 'select'>;

export type NewCommentTable = InferModel<typeof commentTable, 'insert'>;

export const commentTable = sqliteTable(
  'comment',
  {
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
    createdAt: text('created_at')
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (table) => ({
    // This guarantees that the combination of entityId and entityType is unique
    pk: primaryKey(table.entityId, table.entityType),
  })
);
