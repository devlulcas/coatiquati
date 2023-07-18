import { sql, type InferModel } from 'drizzle-orm';
import { bigint, boolean, index, integer, pgTable, text, uniqueIndex } from 'drizzle-orm/pg-core';

export type AuthUserTable = InferModel<typeof authUserTable>;

export const authUserTable = pgTable(
	'auth_user',
	{
		id: text('id').primaryKey().notNull(),
		username: text('username').notNull(),
		name: text('name'),
		email: text('email').notNull(),
		roles: text('roles')
			.array()
			.default(sql`ARRAY['USER']::text[]`)
			.notNull(),
		active: boolean('active').default(true).notNull(),
		banVotes: integer('ban_votes').default(0).notNull(),
		avatar: text('avatar').default('no_profile_picture.webp').notNull()
	},
	(table) => {
		return {
			emailKey: uniqueIndex('auth_user_email_key').on(table.email),
			idKey: uniqueIndex('auth_user_id_key').on(table.id)
		};
	}
);

export const authKeyTable = pgTable(
	'auth_key',
	{
		id: text('id').primaryKey().notNull(),
		hashedPassword: text('hashed_password'),
		userId: text('user_id')
			.notNull()
			.references(() => authUserTable.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
		primaryKey: boolean('primary_key').notNull(),
		expires: bigint('expires', { mode: 'number' })
	},
	(table) => {
		return {
			idKey: uniqueIndex('auth_key_id_key').on(table.id),
			userIdIdx: index('auth_key_user_id_idx').on(table.userId)
		};
	}
);

export const authSessionTable = pgTable(
	'auth_session',
	{
		id: text('id').primaryKey().notNull(),
		userId: text('user_id')
			.notNull()
			.references(() => authUserTable.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
		activeExpires: bigint('active_expires', { mode: 'number' }).notNull(),
		idleExpires: bigint('idle_expires', { mode: 'number' }).notNull()
	},
	(table) => {
		return {
			idKey: uniqueIndex('auth_session_id_key').on(table.id),
			userIdIdx: index('auth_session_user_id_idx').on(table.userId)
		};
	}
);
