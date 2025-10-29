import { relations } from 'drizzle-orm';
import * as t from 'drizzle-orm/pg-core';
import { tableTimestampColumns } from '../lib/helpers';
import { user } from './auth';
import { trails } from './trail';

export type SelectTrailSubscription = typeof trailSubscriptions.$inferSelect;
export type InsertTrailSubscription = typeof trailSubscriptions.$inferInsert;

export const trailSubscriptions = t.pgTable(
  'trail_subscription',
  {
    trailId: t
      .integer('trail_id')
      .notNull()
      .references(() => trails.id, {
        onDelete: 'cascade',
        onUpdate: 'cascade',
      }),
    userId: t
      .text('user_id')
      .notNull()
      .references(() => user.id, {
        onDelete: 'cascade',
        onUpdate: 'cascade',
      }),
    ...tableTimestampColumns,
  },
  (table) => [t.primaryKey({ columns: [table.trailId, table.userId] })]
);

export const trailSubscriptionsRelations = relations(
  trailSubscriptions,
  ({ one }) => ({
    trail: one(trails, {
      fields: [trailSubscriptions.trailId],
      references: [trails.id],
    }),
    user: one(user, {
      fields: [trailSubscriptions.userId],
      references: [user.id],
    }),
  })
);
