import { relations } from 'drizzle-orm';
import { integer, primaryKey, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { tableTimestampColumns } from '../lib/helpers';
import { contentTable } from './content';
import { topicTable } from './topic';
import { trailTable } from './trail';
import { userTable } from './user';

// Contribuições em trilhas
export const trailContributionTable = sqliteTable(
  'trail_contribution',
  {
    trailId: integer('trail_id')
      .references(() => trailTable.id)
      .notNull(),
    userId: text('user_id')
      .references(() => userTable.id)
      .notNull(),
    ...tableTimestampColumns,
  },
  table => ({ pk: primaryKey({ columns: [table.userId, table.trailId] }) }),
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
      .references(() => topicTable.id)
      .notNull(),
    userId: text('user_id')
      .references(() => userTable.id)
      .notNull(),
    ...tableTimestampColumns,
  },
  table => ({ pk: primaryKey({ columns: [table.userId, table.topicId] }) }),
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
    ...tableTimestampColumns,
  },
  table => ({ pk: primaryKey({ columns: [table.userId, table.contentId] }) }),
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
