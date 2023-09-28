import { relations } from 'drizzle-orm';
import { blob, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { userTable } from './user';

export const passwordResetTokenTable = sqliteTable('user_password_reset_token', {
  id: text('id').primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => userTable.id),
  expires: blob('expires', { mode: 'bigint' }).notNull(),
});

export const passwordResetTokenTableRelations = relations(passwordResetTokenTable, ({ one }) => ({
  user: one(userTable, {
    fields: [passwordResetTokenTable.userId],
    references: [userTable.id],
  }),
}));
