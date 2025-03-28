import { z } from "zod";

export const pomodoroSettingsSchema = z.object({
  pomodoroDuration: z.number().min(1).max(60),
  shortBreakDuration: z.number().min(1).max(30),
  longBreakDuration: z.number().min(1).max(60),
  autoStartBreaks: z.boolean(),
  autoStartPomodoros: z.boolean(),
});

export const pomodoroSessionSchema = z.object({
  startTime: z.number(),
  endTime: z.number(),
  type: z.enum(['pomodoro', 'short_break', 'long_break']),
  completed: z.boolean(),
});
