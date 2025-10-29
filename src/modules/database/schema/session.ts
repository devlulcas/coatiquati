import { pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import { userTable } from './user';

export type SessionSelect = typeof sessionTable.$inferSelect;

export const sessionTable = pgTable('user_session', {
  id: text('id').primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => userTable.id),
  expiresAt: timestamp('expires_at').notNull(),
});
