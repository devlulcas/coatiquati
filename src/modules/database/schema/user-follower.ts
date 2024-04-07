import { relations } from 'drizzle-orm';
import { primaryKey, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { tableTimestampColumns } from '../lib/helpers';
import { userTable } from './user';

export const userFollowerTable = sqliteTable(
  'user_follower',
  {
    userId: text('user_id')
      .notNull()
      .references(() => userTable.id, {
        onDelete: 'cascade',
        onUpdate: 'cascade',
      }),
    followerId: text('follower_id')
      .notNull()
      .references(() => userTable.id, {
        onDelete: 'cascade',
        onUpdate: 'cascade',
      }),
    ...tableTimestampColumns,
  },
  table => ({ pk: primaryKey({ columns: [table.followerId, table.userId] }) }),
);

export const userFollowerTableRelations = relations(userFollowerTable, ({ one }) => ({
  user: one(userTable, {
    fields: [userFollowerTable.userId],
    references: [userTable.id],
    relationName: 'followed',
  }),
  follower: one(userTable, {
    fields: [userFollowerTable.followerId],
    references: [userTable.id],
    relationName: 'follower',
  }),
}));
