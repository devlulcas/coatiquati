import type { PomodoroSession } from "@/modules/database/schema/pomodoro-sessions";
import type { PomodoroSettings } from "@/modules/database/schema/pomodoro-settings";

export type PomodoroSettingsInput = Omit<PomodoroSettings, 'id' | 'userId' | 'createdAt' | 'updatedAt'>;
export type PomodoroSessionInput = Omit<PomodoroSession, 'id' | 'userId' | 'createdAt' | 'updatedAt'>;

export type PomodoroTimerType = 'pomodoro' | 'short_break' | 'long_break';

export type PomodoroSessionState = 'idle' | 'running' | 'paused' | 'completed'

export type PomodoroTimerState = {
  previousType: PomodoroTimerType;
  type: PomodoroTimerType;
  timeRemaining: number;
  state: 'idle' | 'running' | 'paused' | 'completed';
}

export type PomodoroStats = {
  totalPomodoros: number;
  totalShortBreaks: number;
  totalLongBreaks: number;
  totalFocusTime: number; // in minutes
  totalBreakTime: number; // in minutes
  streak: number;
  lastCompletedDate: string | null;
}

export const pomodoroSessionStateLabels: Record<PomodoroSessionState, string> = {
  idle: 'Iniciar',
  running: 'Pausar',
  paused: 'Continuar',
  completed: 'Completado',
};

export const pomodoroTimerTypeLabels: Record<PomodoroTimerType, string> = {
  pomodoro: 'Pomodoro',
  short_break: 'Pausa curta',
  long_break: 'Pausa longa',
};
