import { relations, sql, type InferInsertModel, type InferSelectModel } from 'drizzle-orm';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { contentStatus, type ContentStatus } from '../../../shared/constants/content-status';
import { trailContributionTable } from './contribution';
import { topicTable } from './topic';
import { trailSubscriptionTable } from './trail-subscription';
import { userTable } from './user';

export type TrailTable = InferSelectModel<typeof trailTable>;
export type NewTrailTable = InferInsertModel<typeof trailTable>;

export const trailTable = sqliteTable('trail', {
  id: integer('id').primaryKey().notNull(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  thumbnail: text('thumbnail').notNull(),
  status: text('status').$type<ContentStatus>().default(contentStatus.DRAFT).notNull(),
  category: text('category_id').references(() => categoryTable.name, {
    onDelete: 'set null',
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

export const trailTableRelations = relations(trailTable, ({ many, one }) => ({
  category: one(categoryTable, {
    fields: [trailTable.category],
    references: [categoryTable.name],
  }),
  subscriptions: many(trailSubscriptionTable),
  topics: many(topicTable),
  contributors: many(trailContributionTable),
  author: one(userTable, {
    fields: [trailTable.authorId],
    references: [userTable.id],
  }),
}));

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
  createdAt: text('created_at')
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: text('updated_at')
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});

export const categoryTableRelations = relations(categoryTable, ({ many }) => ({
  trails: many(trailTable),
}));
