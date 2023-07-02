import { tsvector } from '$lib/server/db/utils/tsvector';
import { authUser } from '$modules/user/schemas/auth-user';
import type { InferModel } from 'drizzle-orm';
import { boolean, pgTable, text, timestamp, uniqueIndex, uuid } from 'drizzle-orm/pg-core';

export type Trail = InferModel<typeof trail, 'select'>;

export type NewTrail = InferModel<typeof trail, 'insert'>;

export type TrailId = Trail['id'];

export const trail = pgTable(
	'trail',
	{
		id: uuid('id').primaryKey().notNull(),
		title: text('title').notNull(),
		description: text('description').notNull(),
		active: boolean('active').default(true).notNull(),
		thumbnail: text('thumbnail').default('no_profile_picture.webp').notNull(),
		thumbnailDescription: text('thumbnail_description').notNull(),
		authorId: text('user_id')
			.notNull()
			.references(() => authUser.id, { onDelete: 'no action', onUpdate: 'cascade' }),
		searchVector: tsvector('search_vector', {
			sources: ['title', 'description', 'thumbnail_description'],
			weighted: true,
			pg_catalog: 'portuguese'
		}),
		createdAt: timestamp('created_at').defaultNow().notNull(),
		updatedAt: timestamp('updated_at').defaultNow().notNull()
	},
	(table) => {
		return {
			idKey: uniqueIndex('trail_id_key').on(table.id)
		};
	}
);
