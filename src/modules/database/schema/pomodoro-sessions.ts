import {
  type InferInsertModel,
  type InferSelectModel,
  relations,
} from 'drizzle-orm';
import { boolean, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';
import { tableTimestampColumns } from '../lib/helpers';
import { userTable } from './user';

export type PomodoroSession = InferSelectModel<typeof pomodoroSessions>;
export type PomodoroSessionInsert = InferInsertModel<typeof pomodoroSessions>;

export const pomodoroSessions = pgTable('pomodoro_sessions', {
  id: serial('id').primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => userTable.id),
  startTime: timestamp('start_time').notNull(),
  endTime: timestamp('end_time').notNull(),
  type: text('type')
    .notNull()
    .$type<'pomodoro' | 'short_break' | 'long_break'>(),
  completed: boolean('completed').notNull().default(false),
  ...tableTimestampColumns,
});

export const pomodoroSessionsRelations = relations(
  pomodoroSessions,
  ({ one }) => ({
    user: one(userTable, {
      fields: [pomodoroSessions.userId],
      references: [userTable.id],
    }),
  })
);
