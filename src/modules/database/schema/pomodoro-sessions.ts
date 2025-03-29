import { relations, type InferInsertModel, type InferSelectModel } from 'drizzle-orm';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { tableTimestampColumns } from '../lib/helpers';
import { userTable } from './user';

export type PomodoroSession = InferSelectModel<typeof pomodoroSessions>;
export type PomodoroSessionInsert = InferInsertModel<typeof pomodoroSessions>;

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

export const pomodoroSessionsRelations = relations(pomodoroSessions, ({ one }) => ({
  user: one(userTable, {
    fields: [pomodoroSessions.userId],
    references: [userTable.id],
  }),
}));
