import { PomodoroSessionType } from '@/modules/database/schema/pomodoro-sessions';
import { z } from 'zod';

export const pomodoroSettingsSchema = z.object({
  pomodoroDuration: z.number().min(1).max(60),
  shortBreakDuration: z.number().min(1).max(30),
  longBreakDuration: z.number().min(1).max(60),
  autoStartBreaks: z.boolean(),
  autoStartPomodoros: z.boolean(),
});

export type PomodoroSettingsSchema = z.infer<typeof pomodoroSettingsSchema>;

export const pomodoroSessionSchema = z.object({
  startTime: z.date(),
  endTime: z.date(),
  type: z.enum(PomodoroSessionType),
  completed: z.boolean(),
});

export type PomodoroSessionSchema = z.infer<typeof pomodoroSessionSchema>;
