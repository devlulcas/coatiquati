import { relations, type InferInsertModel, type InferSelectModel } from 'drizzle-orm';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import type { ReportReason } from '../../../modules/user-moderation/constants/report';
import { tableTimestampColumns } from '../lib/helpers';
import { userTable } from './user';

export type ReportSelect = InferSelectModel<typeof reportTable>;
export type ReportInsert = InferInsertModel<typeof reportTable>;
export const reportTable = sqliteTable('report', {
  id: integer('id').primaryKey(),
  userId: text('userId')
    .notNull()
    .references(() => userTable.id),
  reportedById: text('reportedById')
    .notNull()
    .references(() => userTable.id),
  type: text('type').$type<ReportReason>().notNull(),
  reportedEntityId: integer('entityId').notNull(),
  reportedEntityType: text('entityType').$type<'trail' | 'topic' | 'content' | 'publication'>().notNull(),
  description: text('description').notNull(),
  status: text('status').$type<'pending' | 'resolved'>().notNull().default('pending'),
  moderatorId: text('moderatorId').references(() => userTable.id),
  ...tableTimestampColumns,
});

export const reportTableRelations = relations(reportTable, ({ one }) => ({
  reportedUser: one(userTable, {
    fields: [reportTable.userId],
    references: [userTable.id],
  }),
  moderator: one(userTable, {
    fields: [reportTable.moderatorId],
    references: [userTable.id],
  }),
  reportedBy: one(userTable, {
    fields: [reportTable.reportedById],
    references: [userTable.id],
  }),
}));
