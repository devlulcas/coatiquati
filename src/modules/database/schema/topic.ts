import { integer, pgTable, serial, text } from 'drizzle-orm/pg-core';
import {
  type ContentStatus,
  contentStatus,
} from '../../../shared/constants/content-status';
import { tableTimestampColumns } from '../lib/helpers';
import { user } from './auth';
import { trail } from './trail';

export type SelectTopic = typeof topic.$inferSelect;
export type InsertTopic = typeof topic.$inferInsert;
export const topic = pgTable('topic', {
  id: serial('id').primaryKey().notNull(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  thumbnail: text('thumbnail'),
  status: text('status')
    .$type<ContentStatus>()
    .default(contentStatus.DRAFT)
    .notNull(),
  trailId: integer('trail_id')
    .notNull()
    .references(() => trail.id, {
      onDelete: 'no action',
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
