import { relations } from 'drizzle-orm';
import {
  boolean,
  integer,
  pgTable,
  text,
  timestamp,
} from 'drizzle-orm/pg-core';
import { comments } from './comment';
import { votes } from './comment-vote';
import { contents } from './content';
import { contributions } from './contribution';
import { feedbacks } from './feedback';
import { feedbackResponses } from './feedback-response';
import { files } from './file';
import { pomodoroSessions } from './pomodoro-sessions';
import { pomodoroSettings } from './pomodoro-settings';
import { publications } from './publication';
import { reports } from './report';
import { todos } from './todos';
import { topics } from './topic';
import { trails } from './trail';
import { trailSubscriptions } from './trail-subscription';
import { userFollowers } from './user-follower';

export type SelectUser = typeof user.$inferSelect;
export type InsertUser = typeof user.$inferInsert;
export const user = pgTable('user', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: boolean('email_verified').default(false).notNull(),
  image: text('image'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
  username: text('username').unique(),
  displayUsername: text('display_username'),
  twoFactorEnabled: boolean('two_factor_enabled').default(false),
  role: text('role'),
  banned: boolean('banned').default(false),
  banReason: text('ban_reason'),
  banExpires: timestamp('ban_expires'),
});

export type SelectSession = typeof session.$inferSelect;
export type InsertSession = typeof session.$inferInsert;
export const session = pgTable('session', {
  id: text('id').primaryKey(),
  expiresAt: timestamp('expires_at').notNull(),
  token: text('token').notNull().unique(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  impersonatedBy: text('impersonated_by'),
});

export type SelectAccount = typeof account.$inferSelect;
export type InsertAccount = typeof account.$inferInsert;
export const account = pgTable('account', {
  id: text('id').primaryKey(),
  accountId: text('account_id').notNull(),
  providerId: text('provider_id').notNull(),
  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  accessToken: text('access_token'),
  refreshToken: text('refresh_token'),
  idToken: text('id_token'),
  accessTokenExpiresAt: timestamp('access_token_expires_at'),
  refreshTokenExpiresAt: timestamp('refresh_token_expires_at'),
  scope: text('scope'),
  password: text('password'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export type SelectVerification = typeof verification.$inferSelect;
export type InsertVerification = typeof verification.$inferInsert;
export const verification = pgTable('verification', {
  id: text('id').primaryKey(),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export type SelectTwoFactor = typeof twoFactor.$inferSelect;
export type InsertTwoFactor = typeof twoFactor.$inferInsert;
export const twoFactor = pgTable('two_factor', {
  id: text('id').primaryKey(),
  secret: text('secret').notNull(),
  backupCodes: text('backup_codes').notNull(),
  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
});

export type SelectPasskey = typeof passkey.$inferSelect;
export type InsertPasskey = typeof passkey.$inferInsert;
export const passkey = pgTable('passkey', {
  id: text('id').primaryKey(),
  name: text('name'),
  publicKey: text('public_key').notNull(),
  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  credentialID: text('credential_id').notNull(),
  counter: integer('counter').notNull(),
  deviceType: text('device_type').notNull(),
  backedUp: boolean('backed_up').notNull(),
  transports: text('transports'),
  createdAt: timestamp('created_at'),
  aaguid: text('aaguid'),
});

export const userRelations = relations(user, ({ many, one }) => ({
  sessions: many(session),
  accounts: many(account),
  verifications: many(verification),
  twoFactor: many(twoFactor),
  passkeys: many(passkey),

  // User followers and following
  followers: many(userFollowers),
  following: many(userFollowers),

  // User authored content
  authoredTrails: many(trails),
  authoredTopics: many(topics),
  authoredContents: many(contents),
  files: many(files),

  // Personal content
  authoredPublications: many(publications),

  // Social interactions
  authoredComments: many(comments),
  authoredVotes: many(votes),
  authoredReports: many(reports),
  contributions: many(contributions),
  trailSubscriptions: many(trailSubscriptions),

  // Personal productivity
  authoredTodos: many(todos),
  authoredPomodoroSessions: many(pomodoroSessions),
  pomodoroSettings: one(pomodoroSettings, {
    fields: [user.id],
    references: [pomodoroSettings.userId],
  }),

  // Feedback and contributions
  feedbacks: many(feedbacks),
  feedbackResponses: many(feedbackResponses),
}));
