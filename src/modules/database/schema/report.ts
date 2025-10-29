import { integer, pgTable, serial, text } from 'drizzle-orm/pg-core';
import type { ReportReason } from '../../../modules/user-moderation/constants/report';
import { tableTimestampColumns } from '../lib/helpers';
import { user } from './auth';

export type SelectReport = typeof reports.$inferSelect;
export type InsertReport = typeof reports.$inferInsert;
export const reports = pgTable('report', {
  id: serial('id').primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => user.id),
  reportedById: text('reported_by_id')
    .notNull()
    .references(() => user.id),
  type: text('type').$type<ReportReason>().notNull(),
  reportedEntityId: integer('entityId').notNull(),
  reportedEntityType: text('entity_type')
    .$type<'trail' | 'topic' | 'content' | 'publication'>()
    .notNull(),
  description: text('description').notNull(),
  status: text('status')
    .$type<'pending' | 'resolved'>()
    .notNull()
    .default('pending'),
  moderatorId: text('moderator_id').references(() => user.id),
  ...tableTimestampColumns,
});
