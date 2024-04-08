import { relations, type InferInsertModel, type InferSelectModel } from 'drizzle-orm';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { tableTimestampColumns } from '../lib/helpers';
import { userTable } from './user';

export type PublicationSelect = InferSelectModel<typeof publicationTable>;
export type PublicationInsert = InferInsertModel<typeof publicationTable>;
export const publicationTable = sqliteTable('publication', {
  id: integer('id').primaryKey(),
  content: text('content').notNull(),
  authorId: text('user_id')
    .notNull()
    .references(() => userTable.id, { onDelete: 'no action', onUpdate: 'cascade' }),
  ...tableTimestampColumns,
});
export const publicationTableRelations = relations(publicationTable, ({ one, many }) => ({
  author: one(userTable, {
    fields: [publicationTable.authorId],
    references: [userTable.id],
  }),
  medias: many(publicationMediaTable),
}));

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
