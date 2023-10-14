import type { Change } from 'diff';
import { relations, sql } from 'drizzle-orm';
import { blob, integer, primaryKey, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { contentTable } from './content';
import { topicTable } from './topic';
import { trailTable } from './trail';
import { userTable } from './user';

// Porque não usar apenas uma tabela de contribuições? Porque essa fazer essa abstração agora só vai complicar as coisas

// Contribuições em trilhas
export const trailContributionTable = sqliteTable(
  'trail_contribution',
  {
    trailId: integer('trail_id')
      .references(() => contentTable.id)
      .notNull(),
    userId: text('user_id')
      .references(() => userTable.id)
      .notNull(),
    contributedAt: text('contributed_at')
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  table => ({
    pk: primaryKey(table.userId, table.trailId),
  }),
);

export const trailContributionTableRelations = relations(trailContributionTable, ({ one }) => ({
  trail: one(trailTable, {
    fields: [trailContributionTable.trailId],
    references: [trailTable.id],
  }),
  user: one(userTable, {
    fields: [trailContributionTable.userId],
    references: [userTable.id],
  }),
}));

// Contribuições em tópicos
export const topicContributionTable = sqliteTable(
  'topic_contribution',
  {
    topicId: integer('topic_id')
      .references(() => contentTable.id)
      .notNull(),
    userId: text('user_id')
      .references(() => userTable.id)
      .notNull(),
    contributedAt: text('contributed_at')
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  table => ({
    pk: primaryKey(table.userId, table.topicId),
  }),
);

export const topicContributionTableRelations = relations(topicContributionTable, ({ one }) => ({
  topic: one(topicTable, {
    fields: [topicContributionTable.topicId],
    references: [topicTable.id],
  }),
  user: one(userTable, {
    fields: [topicContributionTable.userId],
    references: [userTable.id],
  }),
}));

// Contribuições em conteúdos (Usuários comuns podem contribuir com conteúdos)
export const contentContributionTable = sqliteTable(
  'content_contribution',
  {
    contentId: integer('content_id')
      .references(() => contentTable.id)
      .notNull(),
    userId: text('user_id')
      .references(() => userTable.id)
      .notNull(),
    diff: blob('blob', { mode: 'json' }).$type<Change[]>(),
    contributedAt: text('contributed_at')
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  table => ({
    pk: primaryKey(table.userId, table.contentId),
  }),
);

export const contentContributionTableRelations = relations(contentContributionTable, ({ one }) => ({
  content: one(contentTable, {
    fields: [contentContributionTable.contentId],
    references: [contentTable.id],
  }),
  user: one(userTable, {
    fields: [contentContributionTable.userId],
    references: [userTable.id],
  }),
}));
