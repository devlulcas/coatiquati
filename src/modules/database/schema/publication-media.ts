import { relations } from 'drizzle-orm';
import { integer, pgTable, serial, text } from 'drizzle-orm/pg-core';
import { tableTimestampColumns } from '../lib/helpers';
import { publicationTable } from './publication';

export type PublicationMediaSelect = typeof publicationMediaTable.$inferSelect;
export type PublicationMediaInsert = typeof publicationMediaTable.$inferInsert;

export const publicationMediaTable = pgTable('publication_media', {
  id: serial('id').primaryKey(),
  publicationId: integer('publication_id')
    .notNull()
    .references(() => publicationTable.id, { onDelete: 'cascade' }),
  description: text('description').notNull(),
  url: text('url').notNull(),
  type: text('type').notNull().$type<'image' | 'video'>(),
  ...tableTimestampColumns,
});

export const publicationMediaTableRelations = relations(
  publicationMediaTable,
  ({ one }) => ({
    publication: one(publicationTable, {
      fields: [publicationMediaTable.publicationId],
      references: [publicationTable.id],
    }),
  })
);
