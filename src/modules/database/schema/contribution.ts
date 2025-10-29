import { integer, pgTable, primaryKey, text } from 'drizzle-orm/pg-core';
import { tableTimestampColumns } from '../lib/helpers';
import { user } from './auth';
import { contents } from './content';
import { topics } from './topic';
import { trails } from './trail';

export const trailContributions = pgTable(
  'trail_contribution',
  {
    trailId: integer('trail_id')
      .references(() => trails.id)
      .notNull(),
    userId: text('user_id')
      .references(() => user.id)
      .notNull(),
    ...tableTimestampColumns,
  },
  (table) => [primaryKey({ columns: [table.userId, table.trailId] })]
);

// Contribuições em tópicos
export const topicContributions = pgTable(
  'topic_contribution',
  {
    topicId: integer('topic_id')
      .references(() => topics.id)
      .notNull(),
    userId: text('user_id')
      .references(() => user.id)
      .notNull(),
    ...tableTimestampColumns,
  },
  (table) => [primaryKey({ columns: [table.userId, table.topicId] })]
);

// Contribuições em conteúdos (Usuários comuns podem contribuir com conteúdos)
export const contentContributions = pgTable(
  'content_contribution',
  {
    contentId: integer('content_id')
      .references(() => contents.id)
      .notNull(),
    userId: text('user_id')
      .references(() => user.id)
      .notNull(),
    ...tableTimestampColumns,
  },
  (table) => [primaryKey({ columns: [table.userId, table.contentId] })]
);
