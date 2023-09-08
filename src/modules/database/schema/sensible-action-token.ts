import {
  relations,
  type InferInsertModel,
  type InferSelectModel,
} from 'drizzle-orm';
import { blob, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import type { SensibleOperation } from '../../../shared/constants/sensible-operation';
import { userTable } from './user';

export type SensibleOperationTokenTable = InferSelectModel<
  typeof sensibleOperationTokenTable
>;

export type NewSensibleOperationTokenTable = InferInsertModel<
  typeof sensibleOperationTokenTable
>;

export const sensibleOperationTokenTable = sqliteTable(
  'user_sensible_operation_token',
  {
    id: text('id').primaryKey(),
    action: text('action').$type<SensibleOperation>().notNull(),
    description: text('description').notNull(),
    userId: text('user_id')
      .notNull()
      .references(() => userTable.id),
    expires: blob('expires', {
      mode: 'bigint',
    }).notNull(),
  }
);

export const sensibleOperationTokenTableRelations = relations(
  sensibleOperationTokenTable,
  ({ one }) => ({
    user: one(userTable, {
      fields: [sensibleOperationTokenTable.userId],
      references: [userTable.id],
    }),
  })
);
