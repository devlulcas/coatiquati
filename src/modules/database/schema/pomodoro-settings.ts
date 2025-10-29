import { relations } from 'drizzle-orm';
import * as t from 'drizzle-orm/pg-core';
import { tableTimestampColumns } from '../lib/helpers';
import { user } from './auth';

export type SelectPomodoroSettings = typeof pomodoroSettings.$inferSelect;
export type InsertPomodoroSettings = typeof pomodoroSettings.$inferInsert;

export const pomodoroSettings = t.pgTable('pomodoro_settings', {
  id: t.serial('id').primaryKey(),
  userId: t
    .text('user_id')
    .notNull()
    .references(() => user.id, {
      onDelete: 'cascade',
      onUpdate: 'cascade',
    })
    .unique(),
  pomodoroDuration: t
    .integer('pomodoro_duration')
    .notNull()
    .default(25 * 60), // in seconds
  shortBreakDuration: t
    .integer('short_break_duration')
    .notNull()
    .default(5 * 60),
  longBreakDuration: t
    .integer('long_break_duration')
    .notNull()
    .default(15 * 60),
  autoStartBreaks: t.boolean('auto_start_breaks').notNull().default(false),
  autoStartPomodoros: t
    .boolean('auto_start_pomodoros')
    .notNull()
    .default(false),
  ...tableTimestampColumns,
});

export const pomodoroSettingsRelations = relations(
  pomodoroSettings,
  ({ one }) => ({
    user: one(user, {
      fields: [pomodoroSettings.userId],
      references: [user.id],
    }),
  })
);
