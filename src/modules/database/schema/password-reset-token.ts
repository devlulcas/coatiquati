import { relations } from 'drizzle-orm';
import { bigint, pgTable, text } from 'drizzle-orm/pg-core';
import { tableTimestampColumns } from '../lib/helpers';
import { userTable } from './user';

export const passwordResetTokenTable = pgTable('userPasswordResetToken', {
  id: text('id').primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => userTable.id),
  expires: bigint('expires', { mode: 'number' }).notNull(),
  ...tableTimestampColumns,
});

export const passwordResetTokenTableRelations = relations(
  passwordResetTokenTable,
  ({ one }) => ({
    user: one(userTable, {
      fields: [passwordResetTokenTable.userId],
      references: [userTable.id],
    }),
  })
);
