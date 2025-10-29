import { boolean, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';
import { tableTimestampColumns } from '../lib/helpers';
import { user } from './auth';

export type SelectPomodoroSession = typeof pomodoroSessions.$inferSelect;
export type InsertPomodoroSession = typeof pomodoroSessions.$inferInsert;
export const pomodoroSessions = pgTable('pomodoro_session', {
  id: serial('id').primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => user.id),
  startTime: timestamp('start_time', { mode: 'date' }).notNull(),
  endTime: timestamp('end_time', { mode: 'date' }).notNull(),
  type: text('type')
    .notNull()
    .$type<'pomodoro' | 'short_break' | 'long_break'>(),
  completed: boolean('completed').notNull().default(false),
  ...tableTimestampColumns,
});
