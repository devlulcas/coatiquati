import {
  integer,
  primaryKey,
  sqliteTable,
  text,
} from 'drizzle-orm/sqlite-core';
import { trailTable } from './trail';
import { userTable } from './user';

export const trailSubscriptionTable = sqliteTable(
  'trail_subscrition',
  {
    trailId: integer('trail_id')
      .notNull()
      .references(() => trailTable.id, {
        onDelete: 'cascade',
        onUpdate: 'cascade',
      }),
    userId: text('user_id')
      .notNull()
      .references(() => userTable.id, {
        onDelete: 'cascade',
        onUpdate: 'cascade',
      }),
  },
  (table) => ({
    pk: primaryKey(table.trailId, table.userId),
  })
);
