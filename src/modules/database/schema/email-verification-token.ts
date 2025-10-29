import { relations } from 'drizzle-orm';
import { pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import { tableTimestampColumns } from '../lib/helpers';
import { userTable } from './user';

export type EmailVerificationToken =
  typeof emailVerificationTokenTable.$inferSelect;
export type NewEmailVerificationToken =
  typeof emailVerificationTokenTable.$inferInsert;

export const emailVerificationTokenTable = pgTable(
  'user_email_verification_token',
  {
    id: text('id').primaryKey(),
    userId: text('user_id')
      .notNull()
      .references(() => userTable.id),
    expiresAt: timestamp('expires_at').notNull(),
    ...tableTimestampColumns,
  }
);

export const emailVerificationTokenTableRelations = relations(
  emailVerificationTokenTable,
  ({ one }) => ({
    user: one(userTable, {
      fields: [emailVerificationTokenTable.userId],
      references: [userTable.id],
    }),
  })
);
