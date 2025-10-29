import { pgTable, primaryKey, text } from 'drizzle-orm/pg-core';
import { tableTimestampColumns } from '../lib/helpers';
import { user } from './auth';

export const userFollowerTable = pgTable(
  'user_follower',
  {
    userId: text('user_id')
      .notNull()
      .references(() => user.id, {
        onDelete: 'cascade',
        onUpdate: 'cascade',
      }),
    followerId: text('follower_id')
      .notNull()
      .references(() => user.id, {
        onDelete: 'cascade',
        onUpdate: 'cascade',
      }),
    ...tableTimestampColumns,
  },
  (table) => [primaryKey({ columns: [table.followerId, table.userId] })]
);
