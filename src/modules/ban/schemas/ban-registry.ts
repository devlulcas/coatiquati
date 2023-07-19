import type { InferModel } from 'drizzle-orm';
import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { authUserTable } from '../../user/schemas/auth-user';

export type BanRegistryTable = InferModel<typeof banRegistryTable>;

export type NewBanRegistryTable = InferModel<typeof banRegistryTable, 'insert'>;

export type BanRegistryTableId = BanRegistryTable['id'];

export const banRegistryTable = pgTable('ban_registry', {
	id: uuid('id').primaryKey(),
	userId: text('user_id')
		.references(() => authUserTable.id, {
			onDelete: 'cascade',
			onUpdate: 'cascade'
		})
		.notNull(),
	reason: text('reason').notNull(),
	adminId: text('admin_id')
		.references(() => authUserTable.id, {
			onDelete: 'no action',
			onUpdate: 'cascade'
		})
		.notNull(),
	secondAdminId: text('second_admin_id').references(() => authUserTable.id, {
		onDelete: 'no action',
		onUpdate: 'cascade'
	}),
	createdAt: timestamp('created_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at').defaultNow().notNull()
});
