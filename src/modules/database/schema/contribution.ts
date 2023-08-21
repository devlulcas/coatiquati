import type { ParsedDiff } from 'diff';
import { sql } from 'drizzle-orm';
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
    userId: integer('user_id')
      .references(() => userTable.id)
      .notNull(),
    diff: blob('blob', { mode: 'json' }).$type<ParsedDiff>().notNull(),
    contributedAt: text('contributed_at')
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (table) => ({
    pk: primaryKey(table.userId, table.contentId),
  })
);
