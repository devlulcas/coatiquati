import type { PomodoroSession } from '../../database/schema/pomodoro-sessions';
import type { PomodoroSettings } from '../../database/schema/pomodoro-settings';
import type { PomodoroSessionInput, PomodoroSettingsInput } from '../types/pomodoro';

export async function fetchPomodoroSettings(): Promise<PomodoroSettings> {
  const response = await fetch('/api/pomodoro/settings');
  const data = await response.json();

  if (!data.ok) {
    throw new Error(data.error);
  }

  return data.value;
}

export async function updatePomodoroSettings(settings: PomodoroSettingsInput): Promise<PomodoroSettings> {
  const response = await fetch('/api/pomodoro/settings', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(settings),
  });

  const data = await response.json();

  if (!data.ok) {
    throw new Error(data.error);
  }

  return data.value;
}


export async function fetchPomodoroSessions(): Promise<PomodoroSession[]> {
  const response = await fetch('/api/pomodoro/sessions');
  const data = await response.json();

  if (!data.ok) {
    throw new Error(data.error);
  }

  return data.value;
}

export async function createPomodoroSession(session: PomodoroSessionInput): Promise<PomodoroSession> {
  const response = await fetch('/api/pomodoro/sessions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(session),
  });

  const data = await response.json();

  if (!data.ok) {
    throw new Error(data.error);
  }

  return data.value;
}
