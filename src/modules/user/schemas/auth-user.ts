import type { InferModel } from 'drizzle-orm';
import { bigint, boolean, index, pgTable, text, uniqueIndex } from 'drizzle-orm/pg-core';

export type AuthUser = InferModel<typeof authUser>;

export const authUser = pgTable(
	'auth_user',
	{
		id: text('id').primaryKey().notNull(),
		username: text('username').notNull(),
		name: text('name'),
		email: text('email').notNull(),
		roles: text('roles').array().default(['USER']).notNull(),
		active: boolean('active').default(true).notNull(),
		avatar: text('avatar').default('no_profile_picture.webp').notNull()
	},
	(table) => {
		return {
			emailKey: uniqueIndex('auth_user_email_key').on(table.email),
			idKey: uniqueIndex('auth_user_id_key').on(table.id)
		};
	}
);

export const authKey = pgTable(
	'auth_key',
	{
		id: text('id').primaryKey().notNull(),
		hashedPassword: text('hashed_password'),
		userId: text('user_id')
			.notNull()
			.references(() => authUser.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
		primaryKey: boolean('primary_key').notNull(),
		// You can use { mode: "bigint" } if numbers are exceeding js number limitations
		expires: bigint('expires', { mode: 'number' })
	},
	(table) => {
		return {
			idKey: uniqueIndex('auth_key_id_key').on(table.id),
			userIdIdx: index('auth_key_user_id_idx').on(table.userId)
		};
	}
);

export const authSession = pgTable(
	'auth_session',
	{
		id: text('id').primaryKey().notNull(),
		userId: text('user_id')
			.notNull()
			.references(() => authUser.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
		// You can use { mode: "bigint" } if numbers are exceeding js number limitations
		activeExpires: bigint('active_expires', { mode: 'number' }).notNull(),
		// You can use { mode: "bigint" } if numbers are exceeding js number limitations
		idleExpires: bigint('idle_expires', { mode: 'number' }).notNull()
	},
	(table) => {
		return {
			idKey: uniqueIndex('auth_session_id_key').on(table.id),
			userIdIdx: index('auth_session_user_id_idx').on(table.userId)
		};
	}
);
