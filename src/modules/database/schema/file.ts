import { relations, type InferInsertModel, type InferSelectModel } from 'drizzle-orm';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { tableTimestampColumns } from '../lib/helpers';
import { userTable } from './user';

export type FileSelect = InferSelectModel<typeof fileTable>;
export type FileInsert = InferInsertModel<typeof fileTable>;

export const fileTable = sqliteTable('file', {
  userId: text('user_id')
    .notNull()
    .references(() => userTable.id),
  checksum: text('checksum').notNull(),
  fileSize: integer('file_size').notNull(),
  fileType: text('file_type').notNull(),
  filename: text('filename').notNull(),
  key: text('key').notNull(),
  uploadedAt: integer('deleted_at', { mode: 'timestamp' }),
  ...tableTimestampColumns,
});

export const fileTableRelations = relations(fileTable, ({ one }) => ({
  user: one(userTable, {
    fields: [fileTable.userId],
    references: [userTable.id],
  }),
}));
