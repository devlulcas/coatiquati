import type { ParsedDiff } from 'diff';
import { relations, sql } from 'drizzle-orm';
import {
  blob,
  integer,
  primaryKey,
  sqliteTable,
  text,
} from 'drizzle-orm/sqlite-core';
import { contentTable } from './content';
import { userTable } from './user';

export const contributionTable = sqliteTable(
  'contribution',
  {
    contentId: integer('content_id')
      .references(() => contentTable.id)
      .notNull(),
    topicId: integer('topic_id')
      .references(() => contentTable.id)
      .notNull(),
    trailId: integer('trail_id')
      .references(() => contentTable.id)
      .notNull(),
    userId: integer('user_id')
      .references(() => userTable.id)
      .notNull(),
    diff: blob('blob', { mode: 'json' }).$type<ParsedDiff>(),
    contributedAt: text('contributed_at')
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (table) => ({
    pk: primaryKey(table.userId, table.contentId, table.topicId, table.trailId),
  })
);

export const contributionTableRelations = relations(
  contributionTable,
  ({ one }) => ({
    content: one(contentTable, {
      fields: [contributionTable.contentId],
      references: [contentTable.id],
    }),
    topic: one(contentTable, {
      fields: [contributionTable.topicId],
      references: [contentTable.id],
    }),
    trail: one(contentTable, {
      fields: [contributionTable.trailId],
      references: [contentTable.id],
    }),
    user: one(userTable, {
      fields: [contributionTable.userId],
      references: [userTable.id],
    }),
  })
);
