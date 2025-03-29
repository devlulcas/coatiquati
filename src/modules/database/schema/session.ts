import { blob, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { userTable } from './user';

export const sessionTable = sqliteTable('user_session', {
  id: text('id').primaryKey(),
  user_id: text('user_id')
    .notNull()
    .references(() => userTable.id),
  expires_at: blob('expires_at', { mode: 'bigint' }).notNull(),
});
