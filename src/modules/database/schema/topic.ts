import {
  type InferInsertModel,
  type InferSelectModel,
  relations,
} from 'drizzle-orm';
import { integer, pgTable, serial, text } from 'drizzle-orm/pg-core';
import {
  type ContentStatus,
  contentStatus,
} from '../../../shared/constants/content-status';
import { tableTimestampColumns } from '../lib/helpers';
import { contentTable } from './content';
import { topicContributionTable } from './contribution';
import { trailTable } from './trail';
import { userTable } from './user';

export type TopicTable = InferSelectModel<typeof topicTable>;
export type NewTopicTable = InferInsertModel<typeof topicTable>;

export const topicTable = pgTable('topic', {
  id: serial('id').primaryKey().notNull(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  thumbnail: text('thumbnail'),
  status: text('status')
    .$type<ContentStatus>()
    .default(contentStatus.DRAFT)
    .notNull(),
  trailId: integer('trail_id')
    .notNull()
    .references(() => trailTable.id, {
      onDelete: 'no action',
      onUpdate: 'cascade',
    }),
  authorId: text('user_id')
    .notNull()
    .references(() => userTable.id, {
      onDelete: 'no action',
      onUpdate: 'cascade',
    }),
  ...tableTimestampColumns,
});

export const topicTableRelations = relations(topicTable, ({ many, one }) => ({
  trail: one(trailTable, {
    fields: [topicTable.trailId],
    references: [trailTable.id],
  }),
  author: one(userTable, {
    fields: [topicTable.authorId],
    references: [userTable.id],
  }),
  contributors: many(topicContributionTable),
  contents: many(contentTable),
}));
