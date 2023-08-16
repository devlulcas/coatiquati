import { sql, type InferModel } from 'drizzle-orm';
import {
  integer,
  primaryKey,
  sqliteTable,
  text,
} from 'drizzle-orm/sqlite-core';
import { userTable } from './user';

export type TrailTable = InferModel<typeof trailTable, 'select'>;

export type NewTrailTable = InferModel<typeof trailTable, 'insert'>;

export const trailTable = sqliteTable('trail', {
  id: integer('id').primaryKey().notNull(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  thumbnail: text('thumbnail').notNull(),
  status: text('status')
    .$type<'draft' | 'published'>()
    .default('draft')
    .notNull(),
  authorId: text('user_id')
    .notNull()
    .references(() => userTable.id, {
      onDelete: 'no action',
      onUpdate: 'cascade',
    }),
  createdAt: text('created_at')
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: text('updated_at')
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});

export const trailContributorTable = sqliteTable(
  'trail_contributor',
  {
    trailId: integer('trail_id')
      .notNull()
      .references(() => trailTable.id, {
        onDelete: 'cascade',
        onUpdate: 'cascade',
      }),
    userUsername: text('user_username')
      .notNull()
      .references(() => userTable.username, {
        onDelete: 'cascade',
        onUpdate: 'cascade',
      }),
    createdAt: text('created_at')
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: text('updated_at')
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (t) => ({
    primaryKey: primaryKey(t.userUsername, t.trailId),
  })
);
