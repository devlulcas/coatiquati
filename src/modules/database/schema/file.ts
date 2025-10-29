import {
  type InferInsertModel,
  type InferSelectModel,
  relations,
} from 'drizzle-orm';
import { integer, pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import { tableTimestampColumns } from '../lib/helpers';
import { userTable } from './user';

export type FileSelect = InferSelectModel<typeof fileTable>;
export type FileInsert = InferInsertModel<typeof fileTable>;

export const fileTable = pgTable('file', {
  userId: text('user_id')
    .notNull()
    .references(() => userTable.id),
  checksum: text('checksum').notNull(),
  fileSize: integer('file_size').notNull(),
  fileType: text('file_type').notNull(),
  filename: text('filename').notNull(),
  key: text('key').notNull(),
  uploadedAt: timestamp('uploaded_at'),
  ...tableTimestampColumns,
});

export const fileTableRelations = relations(fileTable, ({ one }) => ({
  user: one(userTable, {
    fields: [fileTable.userId],
    references: [userTable.id],
  }),
}));
