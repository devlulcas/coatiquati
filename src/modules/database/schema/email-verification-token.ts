import { relations, type InferInsertModel, type InferSelectModel } from 'drizzle-orm';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { userTable } from './user';

export type EmailVerificationToken = InferSelectModel<typeof emailVerificationTokenTable>;
export type NewEmailVerificationToken = InferInsertModel<typeof emailVerificationTokenTable>;

export const emailVerificationTokenTable = sqliteTable('user_email_verification_token', {
  id: text('id').primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => userTable.id),
  expires: integer('expires', { mode: 'timestamp' }).notNull(),
});

export const emailVerificationTokenTableRelations = relations(emailVerificationTokenTable, ({ one }) => ({
  user: one(userTable, {
    fields: [emailVerificationTokenTable.userId],
    references: [userTable.id],
  }),
}));
