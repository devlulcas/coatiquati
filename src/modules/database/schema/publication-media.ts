import { relations } from 'drizzle-orm';
import * as t from 'drizzle-orm/pg-core';
import { tableTimestampColumns } from '../lib/helpers';
import { publications } from './publication';

export type SelectPublicationMedia = typeof publicationMedias.$inferSelect;
export type InsertPublicationMedia = typeof publicationMedias.$inferInsert;

export enum PublicationMediaType {
  IMAGE = 1,
  VIDEO = 2,
}

export const publicationMedias = t.pgTable('publication_media', {
  id: t.serial('id').primaryKey(),
  publicationId: t
    .integer('publication_id')
    .notNull()
    .references(() => publications.id, {
      onDelete: 'cascade',
      onUpdate: 'cascade',
    }),
  description: t.text('description').notNull(),
  url: t.text('url').notNull(),
  type: t.smallint('type').notNull().$type<PublicationMediaType>(),
  ...tableTimestampColumns,
});

export const publicationMediasRelations = relations(
  publicationMedias,
  ({ one }) => ({
    publication: one(publications, {
      fields: [publicationMedias.publicationId],
      references: [publications.id],
    }),
  })
);
