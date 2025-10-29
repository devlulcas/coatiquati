import { integer, pgTable, serial, text } from 'drizzle-orm/pg-core';
import {
  type ContentStatus,
  contentStatus,
} from '../../../shared/constants/content-status';
import { tableTimestampColumns } from '../lib/helpers';
import { user } from './auth';
import { categories } from './category';

export type SelectTrail = typeof trails.$inferSelect;
export type InsertTrail = typeof trails.$inferInsert;
export const trails = pgTable('trail', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  thumbnail: text('thumbnail').notNull(),
  status: text('status')
    .$type<ContentStatus>()
    .default(contentStatus.DRAFT)
    .notNull(),
  category: integer('category_id').references(() => categories.id, {
    onDelete: 'set null',
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
