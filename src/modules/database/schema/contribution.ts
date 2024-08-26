import { relations, sql } from 'drizzle-orm';
import { integer, primaryKey, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { NOW_AS_INTEGER } from '../lib/helpers';
import { contentTable } from './content';
import { topicTable } from './topic';
import { trailTable } from './trail';
import { userTable } from './user';

// Porque não usar apenas uma tabela de contribuições? Porque essa fazer essa abstração agora só vai complicar as coisas

// Contribuições em trilhas
export const trailContributionTable = sqliteTable(
  'trailContribution',
  {
    trailId: integer('trailId')
      .references(() => trailTable.id)
      .notNull(),
    userId: text('userId')
      .references(() => userTable.id)
      .notNull(),
    contributedAt: integer('contributedAt', { mode: 'timestamp' })
      .notNull()
      .default(NOW_AS_INTEGER)
      .$onUpdate(() => new Date()),
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
  'topicContribution',
  {
    topicId: integer('topicId')
      .references(() => topicTable.id)
      .notNull(),
    userId: text('userId')
      .references(() => userTable.id)
      .notNull(),
    contributedAt: text('contributedAt')
      .default(sql`CURRENTTIMESTAMP`)
      .notNull(),
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
  'contentContribution',
  {
    contentId: integer('contentId')
      .references(() => contentTable.id)
      .notNull(),
    userId: text('userId')
      .references(() => userTable.id)
      .notNull(),
    contributedAt: text('contributedAt')
      .default(sql`CURRENTTIMESTAMP`)
      .notNull(),
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
