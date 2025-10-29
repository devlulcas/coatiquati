import { relations } from 'drizzle-orm';
import * as t from 'drizzle-orm/pg-core';
import { tableTimestampColumns } from '../lib/helpers';
import { user } from './auth';

export type SelectFile = typeof files.$inferSelect;
export type InsertFile = typeof files.$inferInsert;

export const files = t.pgTable('file', {
  id: t.serial('id').primaryKey(),
  userId: t
    .text('user_id')
    .notNull()
    .references(() => user.id, {
      onDelete: 'cascade',
      onUpdate: 'cascade',
    }),
  checksum: t.text('checksum').notNull(),
  fileSize: t.integer('file_size').notNull(),
  fileType: t.text('file_type').notNull(),
  filename: t.text('filename').notNull(),
  key: t.text('key').notNull(),
  uploadedAt: t.timestamp('uploaded_at', { mode: 'date' }),
  ...tableTimestampColumns,
});

export const filesRelations = relations(files, ({ one }) => ({
  user: one(user, {
    fields: [files.userId],
    references: [user.id],
  }),
}));
