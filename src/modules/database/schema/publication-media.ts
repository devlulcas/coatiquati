import { relations, type InferInsertModel, type InferSelectModel } from 'drizzle-orm';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { tableTimestampColumns } from '../lib/helpers';
import { publicationTable } from './publication';

export type PublicationMediaSelect = InferSelectModel<typeof publicationMediaTable>;
export type PublicationMediaInsert = InferInsertModel<typeof publicationMediaTable>;

export const publicationMediaTable = sqliteTable('publication_media', {
  id: integer('id').primaryKey(),
  publicationId: integer('publication_id')
    .notNull()
    .references(() => publicationTable.id, { onDelete: 'cascade' }),
  description: text('description').notNull(),
  url: text('url').notNull(),
  type: text('type').notNull().$type<'image' | 'video'>(),
  ...tableTimestampColumns,
});

export const publicationMediaTableRelations = relations(publicationMediaTable, ({ one }) => ({
  publication: one(publicationTable, {
    fields: [publicationMediaTable.publicationId],
    references: [publicationTable.id],
  }),
}));
