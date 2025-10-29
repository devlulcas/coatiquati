import { integer, pgTable, serial, text } from 'drizzle-orm/pg-core';
import { tableTimestampColumns } from '../lib/helpers';
import { publications } from './publication';

export type SelectPublicationMedia = typeof publicationMedias.$inferSelect;
export type InsertPublicationMedia = typeof publicationMedias.$inferInsert;
export const publicationMedias = pgTable('publication_media', {
  id: serial('id').primaryKey(),
  publicationId: integer('publication_id')
    .notNull()
    .references(() => publications.id, { onDelete: 'cascade' }),
  description: text('description').notNull(),
  url: text('url').notNull(),
  type: text('type').notNull().$type<'image' | 'video'>(),
  ...tableTimestampColumns,
});
