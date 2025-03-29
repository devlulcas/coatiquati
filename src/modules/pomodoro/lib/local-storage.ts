import type { PomodoroSession } from '../../database/schema/pomodoro-sessions';
import type { PomodoroSettings } from '../../database/schema/pomodoro-settings';

const STORAGE_KEYS = {
  SETTINGS: 'pomodoro_settings',
  SESSIONS: 'pomodoro_sessions',
} as const;

export const DEFAULT_POMODORO_CONFIG: PomodoroSettings = {
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

export function getLocalSettings(): PomodoroSettings {
  const stored = localStorage.getItem(STORAGE_KEYS.SETTINGS);
  return stored ? JSON.parse(stored) : DEFAULT_POMODORO_CONFIG;
}

export function setLocalSettings(settings: PomodoroSettings): void {
  localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
}

export function getLocalSessions(): PomodoroSession[] {
  const stored = localStorage.getItem(STORAGE_KEYS.SESSIONS);
  return stored ? JSON.parse(stored) : [];
}

export function setLocalSessions(sessions: PomodoroSession[]): void {
  localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(sessions));
}

export function addLocalSession(session: PomodoroSession): void {
  const sessions = getLocalSessions();
  sessions.push(session);
  setLocalSessions(sessions);
}

export function clearLocalPomodoroData(): void {
  localStorage.removeItem(STORAGE_KEYS.SETTINGS);
  localStorage.removeItem(STORAGE_KEYS.SESSIONS);
}
