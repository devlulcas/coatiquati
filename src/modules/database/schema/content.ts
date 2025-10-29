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
import { user } from './auth';
import { topics } from './topic';

export type SelectContent = typeof contents.$inferSelect;
export type InsertContent = typeof contents.$inferInsert;
export const contents = pgTable('content', {
  id: serial('id').primaryKey().notNull(),
  title: text('title').notNull(),
  active: boolean('active').notNull().default(true),
  contentType: text('content_type').$type<ContentType>().notNull(),
  content: jsonb('content').$type<ContentJSON>().notNull(),
  topicId: integer('topic_id').references(() => topics.id, {
    onDelete: 'cascade',
    onUpdate: 'cascade',
  }),
  authorId: text('user_id')
    .notNull()
    .references(() => user.id, {
      onDelete: 'no action',
      onUpdate: 'cascade',
    }),
  ...tableTimestampColumns,
});
