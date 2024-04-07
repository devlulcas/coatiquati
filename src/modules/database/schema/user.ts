import { relations, type InferSelectModel } from 'drizzle-orm';
import { blob, integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import type { Role } from '../../auth/constants/roles';
import { tableTimestampColumns } from '../lib/helpers';
import { commentVoteTable } from './comment';
import { contentContributionTable, topicContributionTable, trailContributionTable } from './contribution';
import { emailVerificationTokenTable } from './email-verification-token';
import { passwordResetTokenTable } from './password-reset-token';
import { trailTable } from './trail';
import { trailSubscriptionTable } from './trail-subscription';
import { userFollowerTable } from './user-follower';

export type AuthUserTable = InferSelectModel<typeof userTable>;

export const userTable = sqliteTable('user', {
  id: text('id').primaryKey(),
  username: text('username').notNull().unique(),
  role: text('role').$type<Role>().notNull(),
  email: text('email').notNull().unique(),
  avatar: text('avatar').notNull().default('/avatars/original.png'),
  verified: integer('email_verified', { mode: 'boolean' }).default(false),
  isBanned: integer('is_banned', { mode: 'boolean' }).default(false),
  ...tableTimestampColumns,
});

export const userTableRelations = relations(userTable, ({ one, many }) => ({
  emailVerificationTokens: many(emailVerificationTokenTable),
  passwordResetTokens: many(passwordResetTokenTable),
  trailSubscriptions: many(trailSubscriptionTable),
  authoredTrails: many(trailTable),
  authoredTopics: many(trailTable),
  trailContributions: many(trailContributionTable),
  topicContributions: many(topicContributionTable),
  contentContributions: many(contentContributionTable),
  commentVotes: many(commentVoteTable),
  followers: many(userFollowerTable, { relationName: 'followed' }),
  following: many(userFollowerTable, { relationName: 'follower' }),
}));

export const sessionTable = sqliteTable('user_session', {
  id: text('id').primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => userTable.id),
  activeExpires: blob('active_expires', { mode: 'bigint' }).notNull(),
  idleExpires: blob('idle_expires', { mode: 'bigint' }).notNull(),
});

export const keyTable = sqliteTable('user_key', {
  id: text('id').primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => userTable.id),
  hashedPassword: text('hashed_password'),
});
