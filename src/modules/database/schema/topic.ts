import { sql, type InferModel } from 'drizzle-orm';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { trailTable } from './trail';
import { userTable } from './user';

export type TopicTable = InferModel<typeof topicTable, 'select'>;

export type NewTopicTable = InferModel<typeof topicTable, 'insert'>;

export const topicTable = sqliteTable('topic', {
  id: integer('id').primaryKey().notNull(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  status: text('status')
    .$type<'draft' | 'published'>()
    .default('draft')
    .notNull(),
  trailId: integer('trail_id')
    .notNull()
    .references(() => trailTable.id, {
      onDelete: 'no action',
      onUpdate: 'cascade',
    }),
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
