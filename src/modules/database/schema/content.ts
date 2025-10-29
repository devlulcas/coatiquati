import { relations } from 'drizzle-orm';
import {
  boolean,
  integer,
  jsonb,
  pgTable,
  serial,
  text,
} from 'drizzle-orm/pg-core';
import type {
  ContentJSON,
  ContentType,
} from '../../../modules/content/types/content-json-field';
import { tableTimestampColumns } from '../lib/helpers';
import { contentContributionTable } from './contribution';
import { topicTable } from './topic';
import { userTable } from './user';

export type ContentSelect = typeof contentTable.$inferSelect;
export type ContentInsert = typeof contentTable.$inferInsert;

export const contentTable = pgTable('content', {
  id: serial('id').primaryKey().notNull(),
  title: text('title').notNull(),
  active: boolean('active').notNull().default(true),
  contentType: text('content_type').$type<ContentType>().notNull(),
  content: jsonb('content').$type<ContentJSON>().notNull(),
  topicId: integer('topic_id').references(() => topicTable.id, {
    onDelete: 'cascade',
    onUpdate: 'cascade',
  }),
  authorId: text('user_id')
    .notNull()
    .references(() => userTable.id, {
      onDelete: 'no action',
      onUpdate: 'cascade',
    }),
  ...tableTimestampColumns,
});

export const contentTableRelations = relations(
  contentTable,
  ({ one, many }) => ({
    topic: one(topicTable, {
      fields: [contentTable.topicId],
      references: [topicTable.id],
    }),
    author: one(userTable, {
      fields: [contentTable.authorId],
      references: [userTable.id],
    }),
    contributors: many(contentContributionTable),
  })
);
