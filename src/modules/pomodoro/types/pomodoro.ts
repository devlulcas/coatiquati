import type { PomodoroSession } from '@/modules/database/schema/pomodoro-sessions';
import type { PomodoroSettings } from '@/modules/database/schema/pomodoro-settings';

export type PomodoroSettingsInput = Omit<
  PomodoroSettings,
  'id' | 'userId' | 'createdAt' | 'updatedAt'
>;
export type PomodoroSessionInput = Omit<
  PomodoroSession,
  'id' | 'userId' | 'createdAt' | 'updatedAt'
>;

export type PomodoroTimerType = 'pomodoro' | 'short_break' | 'long_break';

type PomodoroSessionState = 'idle' | 'running' | 'paused' | 'completed';

export type PomodoroTimerState = {
  previousType: PomodoroTimerType;
  type: PomodoroTimerType;
  timeRemaining: number;
  state: 'idle' | 'running' | 'paused' | 'completed';
};

export const pomodoroSessionStateLabels: Record<PomodoroSessionState, string> =
  {
    idle: 'Iniciar',
    running: 'Pausar',
    paused: 'Continuar',
    completed: 'Completado',
  };
