import { integer, pgTable, primaryKey, text } from 'drizzle-orm/pg-core';
import { tableTimestampColumns } from '../lib/helpers';
import { user } from './auth';
import { content } from './content';
import { topic } from './topic';
import { trail } from './trail';

export const trailContribution = pgTable(
  'trail_contribution',
  {
    trailId: integer('trail_id')
      .references(() => trail.id)
      .notNull(),
    userId: text('user_id')
      .references(() => user.id)
      .notNull(),
    ...tableTimestampColumns,
  },
  (table) => [primaryKey({ columns: [table.userId, table.trailId] })]
);

// Contribuições em tópicos
export const topicContribution = pgTable(
  'topic_contribution',
  {
    topicId: integer('topic_id')
      .references(() => topic.id)
      .notNull(),
    userId: text('user_id')
      .references(() => user.id)
      .notNull(),
    ...tableTimestampColumns,
  },
  (table) => [primaryKey({ columns: [table.userId, table.topicId] })]
);

// Contribuições em conteúdos (Usuários comuns podem contribuir com conteúdos)
export const contentContribution = pgTable(
  'content_contribution',
  {
    contentId: integer('content_id')
      .references(() => content.id)
      .notNull(),
    userId: text('user_id')
      .references(() => user.id)
      .notNull(),
    ...tableTimestampColumns,
  },
  (table) => [primaryKey({ columns: [table.userId, table.contentId] })]
);
