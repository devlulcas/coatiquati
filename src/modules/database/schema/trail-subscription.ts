import { integer, pgTable, primaryKey, text } from 'drizzle-orm/pg-core';
import { tableTimestampColumns } from '../lib/helpers';
import { user } from './auth';
import { trail } from './trail';

export type SelectTrailSubscription = typeof trailSubscription.$inferSelect;
export type InsertTrailSubscription = typeof trailSubscription.$inferInsert;
export const trailSubscription = pgTable(
  'trail_subscription',
  {
    trailId: integer('trail_id')
      .notNull()
      .references(() => trail.id, {
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
