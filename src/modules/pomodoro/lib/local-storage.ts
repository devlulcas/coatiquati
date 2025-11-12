import type { SelectPomodoroSession } from '@/modules/database/schema/pomodoro-sessions';
import type { SelectPomodoroSettings } from '@/modules/database/schema/pomodoro-settings';

const STORAGE_KEYS = {
  SETTINGS: 'pomodoro_settings',
  SESSIONS: 'pomodoro_sessions',
} as const;

export const DEFAULT_POMODORO_CONFIG: SelectPomodoroSettings = {
  id: 0,
  userId: '0',
  pomodoroDuration: 25 * 60,
  shortBreakDuration: 5 * 60,
  longBreakDuration: 15 * 60,
  autoStartBreaks: false,
  autoStartPomodoros: false,
  createdAt: new Date(),
  updatedAt: new Date(),
  deletedAt: null,
};

export function getLocalSettings(): SelectPomodoroSettings {
  const stored = localStorage.getItem(STORAGE_KEYS.SETTINGS);
  return stored ? JSON.parse(stored) : DEFAULT_POMODORO_CONFIG;
}

export function setLocalSettings(settings: SelectPomodoroSettings): void {
  localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
}

export function getLocalSessions(): SelectPomodoroSession[] {
  const stored = localStorage.getItem(STORAGE_KEYS.SESSIONS);
  return stored ? JSON.parse(stored) : [];
}

export function setLocalSessions(sessions: SelectPomodoroSession[]): void {
  localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(sessions));
}

export function addLocalSession(session: SelectPomodoroSession): void {
  const sessions = getLocalSessions();
  sessions.push(session);
  setLocalSessions(sessions);
}

export function clearLocalPomodoroData(): void {
  localStorage.removeItem(STORAGE_KEYS.SETTINGS);
  localStorage.removeItem(STORAGE_KEYS.SESSIONS);
}
