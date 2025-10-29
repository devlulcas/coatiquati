import { relations } from 'drizzle-orm';
import { boolean, integer, pgTable, serial, text } from 'drizzle-orm/pg-core';
import { tableTimestampColumns } from '../lib/helpers';
import { userTable } from './user';

export type PomodoroSettings = typeof pomodoroSettings.$inferSelect;
export type PomodoroSettingsInsert = typeof pomodoroSettings.$inferInsert;

export const pomodoroSettings = pgTable('pomodoro_settings', {
  id: serial('id').primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => userTable.id),
  pomodoroDuration: integer('pomodoro_duration')
    .notNull()
    .default(25 * 60), // in seconds
  shortBreakDuration: integer('short_break_duration')
    .notNull()
    .default(5 * 60),
  longBreakDuration: integer('long_break_duration')
    .notNull()
    .default(15 * 60),
  autoStartBreaks: boolean('auto_start_breaks').notNull().default(false),
  autoStartPomodoros: boolean('auto_start_pomodoros').notNull().default(false),
  ...tableTimestampColumns,
});

export const pomodoroSettingsRelations = relations(
  pomodoroSettings,
  ({ one }) => ({
    user: one(userTable, {
      fields: [pomodoroSettings.userId],
      references: [userTable.id],
    }),
  })
);
