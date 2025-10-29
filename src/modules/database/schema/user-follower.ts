import { relations } from 'drizzle-orm';
import * as t from 'drizzle-orm/pg-core';
import { tableTimestampColumns } from '../lib/helpers';
import { user } from './auth';

export type SelectUserFollower = typeof userFollowers.$inferSelect;
export type InsertUserFollower = typeof userFollowers.$inferInsert;

export const userFollowers = t.pgTable(
  'user_follower',
  {
    userId: t
      .text('user_id')
      .notNull()
      .references(() => user.id, {
        onDelete: 'cascade',
        onUpdate: 'cascade',
      }),
    followerId: t
      .text('follower_id')
      .notNull()
      .references(() => user.id, {
        onDelete: 'cascade',
        onUpdate: 'cascade',
      }),
    ...tableTimestampColumns,
  },
  (table) => [t.primaryKey({ columns: [table.followerId, table.userId] })]
);

export const userFollowersRelations = relations(userFollowers, ({ one }) => ({
  user: one(user, {
    fields: [userFollowers.userId],
    references: [user.id],
  }),
  follower: one(user, {
    fields: [userFollowers.followerId],
    references: [user.id],
  }),
}));
