import type { InferModel } from 'drizzle-orm';
import { boolean, pgTable, text, timestamp, uniqueIndex, uuid } from 'drizzle-orm/pg-core';
import { authUserTable } from '../../../modules/user/schemas/auth-user';

export type TrailTable = InferModel<typeof trailTable, 'select'>;

export type NewTrailTable = InferModel<typeof trailTable, 'insert'>;

export const trailTable = pgTable(
	'trail',
	{
		id: uuid('id').primaryKey().notNull(),
		title: text('title').notNull(),
		description: text('description').notNull(),
    slug: text('slug').notNull(),
		active: boolean('active').default(true).notNull(),
		thumbnail: text('thumbnail').default('no_profile_picture.webp').notNull(),
		thumbnailDescription: text('thumbnail_description').notNull(),
		authorId: text('user_id')
			.notNull()
			.references(() => authUserTable.id, { onDelete: 'no action', onUpdate: 'cascade' }),
		createdAt: timestamp('created_at').defaultNow().notNull(),
		updatedAt: timestamp('updated_at').defaultNow().notNull()
	},
	(table) => {
		return {
			idKey: uniqueIndex('trail_id_key').on(table.id),
      slugKey: uniqueIndex('trail_slug_key').on(table.slug)
		};
	}
);

export const trailContributorTable = pgTable(
  'trail_contributor',
  {
    trailId: uuid('trail_id').notNull().references(() => trailTable.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
    userId: text('user_id').notNull().references(() => authUserTable.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull()
  },
  (table) => {
    return {
      idKey: uniqueIndex('trail_contributor_id_key').on(table.trailId, table.userId)
    };
  }
);
