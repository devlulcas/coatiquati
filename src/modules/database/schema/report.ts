import { relations, sql } from 'drizzle-orm';
import { sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { userTable } from './user';

type ReportReason =
  | 'not_safe_for_work'
  | 'hate_speech'
  | 'harassment_or_bullying'
  | 'spam_or_unsolicited_commercial_content'
  | 'copyright_violation'
  | 'false_or_misleading_information'
  | 'fraudulent_or_suspicious_activity'
  | 'dangerous_or_threatening_behavior'
  | 'privacy_invasion'
  | 'violent_or_graphic_content'
  | 'use_of_fake_account_or_bot'
  | 'platform_policy_violation';

export const reportTable = sqliteTable('report', {
  id: text('id').primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => userTable.id),
  type: text('type').$type<ReportReason>().notNull(),
  reportedEntityId: text('entity_id').notNull(),
  reportedEntityType: text('entity_type')
    .$type<'trail' | 'topic' | 'content'>()
    .notNull(),
  description: text('description').notNull(),
  status: text('status')
    .$type<'pending' | 'resolved'>()
    .notNull()
    .default('pending'),
  moderatorId: text('moderator_id').references(() => userTable.id),
  createdAt: text('created_at')
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: text('updated_at')
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});

export const reportTableRelations = relations(reportTable, ({ one }) => ({
  user: one(userTable, {
    fields: [reportTable.userId],
    references: [userTable.id],
  }),
  moderator: one(userTable, {
    fields: [reportTable.moderatorId],
    references: [userTable.id],
  }),
}));

export const banTable = sqliteTable('ban', {
  id: text('id').primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => userTable.id),
  moderatorId: text('moderator_id').references(() => userTable.id),
  reason: text('reason').notNull(),
  expires: text('expires').notNull(),
  createdAt: text('created_at')
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: text('updated_at')
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});

export const banTableRelations = relations(banTable, ({ one }) => ({
  user: one(userTable, {
    fields: [banTable.userId],
    references: [userTable.id],
  }),
  moderator: one(userTable, {
    fields: [banTable.moderatorId],
    references: [userTable.id],
  }),
}));
