import { integer, pgTable, serial, text } from 'drizzle-orm/pg-core';
import { tableTimestampColumns } from '../lib/helpers';
import { publication } from './publication';

export type SelectPublicationMedia = typeof publicationMedia.$inferSelect;
export type InsertPublicationMedia = typeof publicationMedia.$inferInsert;
export const publicationMedia = pgTable('publication_media', {
  id: serial('id').primaryKey(),
  publicationId: integer('publication_id')
    .notNull()
    .references(() => publication.id, { onDelete: 'cascade' }),
  description: text('description').notNull(),
  url: text('url').notNull(),
  type: text('type').notNull().$type<'image' | 'video'>(),
  ...tableTimestampColumns,
});
