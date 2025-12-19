import { relations } from 'drizzle-orm';
import * as t from 'drizzle-orm/pg-core';
import { tableTimestampColumns } from '../lib/helpers';
import type { PomodoroSessionType } from '../lib/pomodoro-enum';
import { user } from './auth';

export type SelectPomodoroSession = typeof pomodoroSessions.$inferSelect;
export type InsertPomodoroSession = typeof pomodoroSessions.$inferInsert;

export const pomodoroSessions = t.pgTable('pomodoro_session', {
  id: t.serial('id').primaryKey(),
  userId: t
    .text('user_id')
    .notNull()
    .references(() => user.id, {
      onDelete: 'cascade',
      onUpdate: 'cascade',
    }),
  startTime: t.timestamp('start_time', { mode: 'date' }).notNull(),
  endTime: t.timestamp('end_time', { mode: 'date' }).notNull(),
  type: t.smallint('type').notNull().$type<PomodoroSessionType>(),
  completed: t.boolean('completed').notNull().default(false),
  ...tableTimestampColumns,
});

export const pomodoroSessionsRelations = relations(pomodoroSessions, ({ one }) => ({
  user: one(user, {
    fields: [pomodoroSessions.userId],
    references: [user.id],
  }),
}));
