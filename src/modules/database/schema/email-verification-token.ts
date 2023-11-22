import { type InferInsertModel, type InferSelectModel, relations } from 'drizzle-orm';
import { blob, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { userTable } from './user';

export type EmailVerificationToken = InferSelectModel<typeof emailVerificationTokenTable>;
export type NewEmailVerificationToken = InferInsertModel<typeof emailVerificationTokenTable>;

export const emailVerificationTokenTable = sqliteTable('user_email_verification_token', {
  id: text('id').primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => userTable.id),
  expires: blob('expires', {
    mode: 'bigint',
  }).notNull(),
});

export const emailVerificationTokenTableRelations = relations(emailVerificationTokenTable, ({ one }) => ({
  user: one(userTable, {
    fields: [emailVerificationTokenTable.userId],
    references: [userTable.id],
  }),
}));
