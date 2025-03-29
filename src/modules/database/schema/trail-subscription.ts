import { relations } from 'drizzle-orm';
import { integer, primaryKey, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { tableTimestampColumns } from '../lib/helpers';
import { trailTable } from './trail';
import { userTable } from './user';

export const trailSubscriptionTable = sqliteTable(
  'trail_subscrition',
  {
    trailId: integer('trail_id')
      .notNull()
      .references(() => trailTable.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
    userId: text('user_id')
      .notNull()
      .references(() => userTable.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
    ...tableTimestampColumns,
  },
  table => ({ pk: primaryKey({ columns: [table.trailId, table.userId] }) }),
);

export const trailSubscriptionTableRelations = relations(trailSubscriptionTable, ({ one }) => ({
  trail: one(trailTable, {
    fields: [trailSubscriptionTable.trailId],
    references: [trailTable.id],
  }),
  user: one(userTable, {
    fields: [trailSubscriptionTable.userId],
    references: [userTable.id],
  }),
}));
