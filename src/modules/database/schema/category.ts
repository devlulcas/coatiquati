import { relations, type InferInsertModel, type InferSelectModel } from 'drizzle-orm';
import { sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { tableTimestampColumns } from '../lib/helpers';
import { trailTable } from './trail';
import { userTable } from './user';

export type CategoryTable = InferSelectModel<typeof categoryTable>;
export type NewCategoryTable = InferInsertModel<typeof categoryTable>;

export const categoryTable = sqliteTable('category', {
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
