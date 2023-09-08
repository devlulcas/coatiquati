import { relations, sql, type InferSelectModel } from 'drizzle-orm';
import { blob, integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import type { Role } from '../../auth/constants/roles';
import { contributionTable } from './contribution';
import { emailVerificationTokenTable } from './email-verification-token';
import { passwordResetTokenTable } from './password-reset-token';
import { sensibleOperationTokenTable } from './sensible-action-token';
import { trailTable } from './trail';
import { trailSubscriptionTable } from './trail-subscription';

export type AuthUserTable = InferSelectModel<typeof userTable>;

export const userTable = sqliteTable('user', {
  id: text('id').primaryKey(),
  username: text('username').notNull().unique(),
  role: text('role').$type<Role>().notNull(),
  email: text('email').notNull().unique(),
  avatar: text('avatar'),
  email_verified: integer('email_verified', { mode: 'boolean' }).default(false),
  createdAt: text('created_at')
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: text('updated_at')
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});

export const userTableRelations = relations(userTable, ({ one, many }) => ({
  emailVerificationTokens: many(emailVerificationTokenTable),
  passwordResetTokens: many(passwordResetTokenTable),
  sensibleActionTokens: many(sensibleOperationTokenTable),
  trailSubscriptions: many(trailSubscriptionTable),
  authoredTrails: many(trailTable),
  authoredTopics: many(trailTable),
  contributions: many(contributionTable),
}));

export const sessionTable = sqliteTable('user_session', {
  id: text('id').primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => userTable.id),
  activeExpires: blob('active_expires', {
    mode: 'bigint',
  }).notNull(),
  idleExpires: blob('idle_expires', {
    mode: 'bigint',
  }).notNull(),
});

export const keyTable = sqliteTable('user_key', {
  id: text('id').primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => userTable.id),
  hashedPassword: text('hashed_password'),
});
