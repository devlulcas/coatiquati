import { integer, pgTable, primaryKey, text } from 'drizzle-orm/pg-core';
import { tableTimestampColumns } from '../lib/helpers';
import { user } from './auth';
import { trails } from './trail';

export type SelectTrailSubscription = typeof trailSubscriptions.$inferSelect;
export type InsertTrailSubscription = typeof trailSubscriptions.$inferInsert;
export const trailSubscriptions = pgTable(
  'trail_subscription',
  {
    trailId: integer('trail_id')
      .notNull()
      .references(() => trails.id, {
        onDelete: 'cascade',
        onUpdate: 'cascade',
      }),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, {
        onDelete: 'cascade',
        onUpdate: 'cascade',
      }),
    ...tableTimestampColumns,
  },
  (table) => [primaryKey({ columns: [table.trailId, table.userId] })]
);
