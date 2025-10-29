import { relations } from 'drizzle-orm';
import { pgTable, serial, text } from 'drizzle-orm/pg-core';
import { tableTimestampColumns } from '../lib/helpers';
import { trails } from './trail';

export type SelectCategory = typeof categories.$inferSelect;
export type InsertCategory = typeof categories.$inferInsert;

export const categories = pgTable('category', {
  id: serial('id').primaryKey(),
  name: text('name').notNull().unique(),
  description: text('description'),
  thumbnail: text('thumbnail'),
  color: text('color'),
  icon: text('icon'),
  ...tableTimestampColumns,
});

export const categoriesRelations = relations(categories, ({ many }) => ({
  trails: many(trails),
}));
