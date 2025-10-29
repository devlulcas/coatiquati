import { relations } from 'drizzle-orm';
import { pgTable, serial, text } from 'drizzle-orm/pg-core';
import { tableTimestampColumns } from '../lib/helpers';
import { publicationMediaTable } from './publication-media';
import { userTable } from './user';

export type PublicationSelect = typeof publicationTable.$inferSelect;
export type PublicationInsert = typeof publicationTable.$inferInsert;

export const publicationTable = pgTable('publication', {
  id: serial('id').primaryKey(),
  content: text('content').notNull(),
  authorId: text('userId')
    .notNull()
    .references(() => userTable.id, {
      onDelete: 'no action',
      onUpdate: 'cascade',
    }),
  ...tableTimestampColumns,
});

export const publicationTableRelations = relations(
  publicationTable,
  ({ one, many }) => ({
    author: one(userTable, {
      fields: [publicationTable.authorId],
      references: [userTable.id],
    }),
    medias: many(publicationMediaTable),
  })
);
