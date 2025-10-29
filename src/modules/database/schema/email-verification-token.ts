import {
  type InferInsertModel,
  type InferSelectModel,
  relations,
} from 'drizzle-orm';
import { pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import { tableTimestampColumns } from '../lib/helpers';
import { userTable } from './user';

export type EmailVerificationToken = InferSelectModel<
  typeof emailVerificationTokenTable
>;
export type NewEmailVerificationToken = InferInsertModel<
  typeof emailVerificationTokenTable
>;

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
