import type { InferModel } from 'drizzle-orm';
import { blob, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { userTable } from './user';

export type SensibleOperationTokenTable = InferModel<
  typeof sensibleOperationTokenTable,
  'select'
>;

export type NewSensibleOperationTokenTable = InferModel<
  typeof sensibleOperationTokenTable,
  'insert'
>;

export const sensibleOperationTokenTable = sqliteTable(
  'user_sensible_operation_token',
  {
    id: text('id').primaryKey(),
    action: text('action').notNull(),
    description: text('description').notNull(),
    userId: text('user_id')
      .notNull()
      .references(() => userTable.id),
    expires: blob('expires', {
      mode: 'bigint',
    }).notNull(),
  }
);
