import type { InferSelectModel } from 'drizzle-orm';
import { pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import { userTable } from './user';

export type SessionSelect = InferSelectModel<typeof sessionTable>;

export const sessionTable = pgTable('user_session', {
  id: text('id').primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => userTable.id),
  expiresAt: timestamp('expires_at').notNull(),
});
