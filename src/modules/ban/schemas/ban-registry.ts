import type { InferModel } from 'drizzle-orm';
import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { authUser } from '../../user/schemas/auth-user';

export type BanRegistry = InferModel<typeof banRegistry>;

export type NewBanRegistry = InferModel<typeof banRegistry, 'insert'>;

export type BanRegistryId = BanRegistry['id'];

export const banRegistry = pgTable('ban_registry', {
	id: uuid('id').primaryKey(),
	userId: text('user_id')
		.references(() => authUser.id, {
			onDelete: 'cascade',
			onUpdate: 'cascade'
		})
		.notNull(),
	reason: text('reason').notNull(),
	adminId: text('admin_id')
		.references(() => authUser.id, {
			onDelete: 'no action',
			onUpdate: 'cascade'
		})
		.notNull(),
	secondAdminId: text('second_admin_id').references(() => authUser.id, {
		onDelete: 'no action',
		onUpdate: 'cascade'
	}),
	createdAt: timestamp('created_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at').defaultNow().notNull()
});
