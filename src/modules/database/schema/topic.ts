import { relations, sql, type InferInsertModel, type InferSelectModel } from 'drizzle-orm';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { contentStatus, type ContentStatus } from '../../../shared/constants/content-status';
import { commentTable } from './comment';
import { contentTable } from './content';
import { contributionTable } from './contribution';
import { trailTable } from './trail';
import { userTable } from './user';

export type TopicTable = InferSelectModel<typeof topicTable>;

export type NewTopicTable = InferInsertModel<typeof topicTable>;

export const topicTable = sqliteTable('topic', {
  id: integer('id').primaryKey().notNull(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  thumbnail: text('thumbnail'),
  status: text('status').$type<ContentStatus>().default(contentStatus.DRAFT).notNull(),
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

export const topicTableRelations = relations(topicTable, ({ many, one }) => ({
  trail: one(trailTable, {
    fields: [topicTable.trailId],
    references: [trailTable.id],
  }),
  author: one(userTable, {
    fields: [topicTable.authorId],
    references: [userTable.id],
  }),
  comments: many(commentTable),
  contributors: many(contributionTable),
  contents: many(contentTable),
}));
