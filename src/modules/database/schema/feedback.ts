import { relations, sql, type InferInsertModel, type InferSelectModel } from 'drizzle-orm';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { userTable } from './user';

export type Feedback = InferSelectModel<typeof feedbackTable>;
export type NewFeedback = InferInsertModel<typeof feedbackTable>;

export const feedbackTable = sqliteTable('feedback', {
  id: integer('id').primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => userTable.id),
  type: text('type').notNull().$type<'bug' | 'feature' | 'improvement'>(),
  content: text('content', { mode: 'json' }).$type<string>().notNull(),
  softwareVersion: text('software_version').notNull(),
  createdAt: text('created_at')
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: text('updated_at')
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});

export const feedbackTableRelations = relations(feedbackTable, ({ one }) => ({
  user: one(userTable, {
    fields: [feedbackTable.userId],
    references: [userTable.id],
  }),
}));
