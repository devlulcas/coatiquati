import { relations } from 'drizzle-orm';
import { pgTable, text } from 'drizzle-orm/pg-core';
import { tableTimestampColumns } from '../lib/helpers';
import { trailTable } from './trail';
import { userTable } from './user';

export type CategoryTable = typeof categoryTable.$inferSelect;
export type NewCategoryTable = typeof categoryTable.$inferInsert;

export const categoryTable = pgTable('category', {
  name: text('name').primaryKey().notNull().unique(),
  authorId: text('user_id')
    .notNull()
    .references(() => userTable.id, {
      onDelete: 'set null',
      onUpdate: 'cascade',
    }),
  ...tableTimestampColumns,
});

export const categoryTableRelations = relations(categoryTable, ({ many }) => ({
  trails: many(trailTable),
}));
