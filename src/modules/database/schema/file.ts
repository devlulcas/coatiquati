import { integer, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';
import { tableTimestampColumns } from '../lib/helpers';
import { user } from './auth';

export type SelectFile = typeof files.$inferSelect;
export type InsertFile = typeof files.$inferInsert;
export const files = pgTable('file', {
  id: serial('id').primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => user.id),
  checksum: text('checksum').notNull(),
  fileSize: integer('file_size').notNull(),
  fileType: text('file_type').notNull(),
  filename: text('filename').notNull(),
  key: text('key').notNull(),
  uploadedAt: timestamp('uploaded_at', { mode: 'date' }),
  ...tableTimestampColumns,
});
