import { relations, type InferInsertModel, type InferSelectModel } from 'drizzle-orm';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import type { ContentJSON, ContentType } from '../../../modules/content/types/content-json-field';
import { tableTimestampColumns } from '../lib/helpers';
import { contentContributionTable } from './contribution';
import { topicTable } from './topic';
import { userTable } from './user';


export type ContentSelect = InferSelectModel<typeof contentTable>;
export type ContentInsert = InferInsertModel<typeof contentTable>;

export const contentTable = sqliteTable('content', {
  id: integer('id').primaryKey().notNull(),
  title: text('title').notNull(),
  active: integer('active', { mode: 'boolean' }).notNull().default(true),
  contentType: text('content_type').$type<ContentType>().notNull(),
  content: text('content', { mode: 'json' }).$type<ContentJSON>().notNull(),
  topicId: integer('topic_id').references(() => topicTable.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
  authorId: text('user_id')
    .notNull()
    .references(() => userTable.id, { onDelete: 'no action', onUpdate: 'cascade' }),
  ...tableTimestampColumns,
});

export const contentTableRelations = relations(contentTable, ({ one, many }) => ({
  topic: one(topicTable, {
    fields: [contentTable.topicId],
    references: [topicTable.id],
  }),
  author: one(userTable, {
    fields: [contentTable.authorId],
    references: [userTable.id],
  }),
  contributors: many(contentContributionTable),
}));
