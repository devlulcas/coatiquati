import type { PomodoroSessionType } from '@/modules/database/lib/pomodoro-enum';

export type PomodoroSessionState = 'idle' | 'running' | 'paused' | 'completed';

export type PomodoroTimerState = {
  previousType: PomodoroSessionType;
  type: PomodoroSessionType;
  timeRemaining: number;
  state: PomodoroSessionState;
};

export const pomodoroSessionStateLabels: Record<PomodoroSessionState, string> = {
  idle: 'Iniciar',
  running: 'Pausar',
  paused: 'Continuar',
  completed: 'Completado',
};
