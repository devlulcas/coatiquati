import { sql, type InferModel } from 'drizzle-orm';
import { blob, integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export type AuthUserTable = InferModel<typeof userTable, 'select'>;

export const userTable = sqliteTable('user', {
  id: text('id').primaryKey(),
  username: text('username').notNull().unique(),
  role: text('role').notNull(),
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
