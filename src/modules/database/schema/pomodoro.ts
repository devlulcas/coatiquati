import { relations, type InferInsertModel, type InferSelectModel } from 'drizzle-orm';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { tableTimestampColumns } from '../lib/helpers';
import { userTable } from './user';

export type PomodoroSettings = InferSelectModel<typeof pomodoroSettings>;
export type PomodoroSession = InferSelectModel<typeof pomodoroSessions>;

export type PomodoroSettingsInsert = InferInsertModel<typeof pomodoroSettings>;
export type PomodoroSessionInsert = InferInsertModel<typeof pomodoroSessions>;

export const pomodoroSettings = sqliteTable('pomodoro_settings', {
  id: integer('id').primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => userTable.id),
  pomodoroDuration: integer('pomodoro_duration').notNull().default(25 * 60), // in seconds
  shortBreakDuration: integer('short_break_duration').notNull().default(5 * 60),
  longBreakDuration: integer('long_break_duration').notNull().default(15 * 60),
  autoStartBreaks: integer('auto_start_breaks', { mode: 'boolean' }).notNull().default(false),
  autoStartPomodoros: integer('auto_start_pomodoros', { mode: 'boolean' }).notNull().default(false),
  ...tableTimestampColumns,
});

export const pomodoroSessions = sqliteTable('pomodoro_sessions', {
  id: integer('id').primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => userTable.id),
  startTime: integer('start_time', { mode: 'timestamp' }).notNull(),
  endTime: integer('end_time', { mode: 'timestamp' }).notNull(),
  type: text('type', { enum: ['pomodoro', 'short_break', 'long_break'] }).notNull(),
  completed: integer('completed', { mode: 'boolean' }).notNull().default(false),
  ...tableTimestampColumns,
});


export const pomodoroSettingsRelations = relations(pomodoroSettings, ({ one }) => ({
  user: one(userTable, {
    fields: [pomodoroSettings.userId],
    references: [userTable.id],
  }),
}));

export const pomodoroSessionsRelations = relations(pomodoroSessions, ({ one }) => ({
  user: one(userTable, {
    fields: [pomodoroSessions.userId],
    references: [userTable.id],
  }),
}));
