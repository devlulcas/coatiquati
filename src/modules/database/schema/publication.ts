import { relations } from 'drizzle-orm';
import * as t from 'drizzle-orm/pg-core';
import { tableTimestampColumns } from '../lib/helpers';
import { user } from './auth';
import { comments } from './comment';
import { publicationMedias } from './publication-media';
import { reports } from './report';
import { votes } from './vote';

export type SelectPublication = typeof publications.$inferSelect;
export type InsertPublication = typeof publications.$inferInsert;

export const publications = t.pgTable('publication', {
  id: t.serial('id').primaryKey(),
  content: t.text('content').notNull(),
  userId: t
    .text('user_id')
    .notNull()
    .references(() => user.id, {
      onDelete: 'no action',
      onUpdate: 'cascade',
    }),
  ...tableTimestampColumns,
});

export const publicationsRelations = relations(publications, ({ one, many }) => ({
  user: one(user, {
    fields: [publications.userId],
    references: [user.id],
  }),
  medias: many(publicationMedias),
  comments: many(comments),
  votes: many(votes),
  reports: many(reports),
}));
