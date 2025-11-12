import type { SelectPomodoroSession } from '@/modules/database/schema/pomodoro-sessions';
import type { SelectPomodoroSettings } from '@/modules/database/schema/pomodoro-settings';
import type {
  PomodoroSessionSchema,
  PomodoroSettingsSchema,
} from '../schemas/pomodoro-schema';

export async function fetchPomodoroSettings(): Promise<SelectPomodoroSettings> {
  const response = await fetch('/api/pomodoro/settings');
  const data = await response.json();

  if (!data.ok) {
    throw new Error(data.error);
  }

  return data.value;
}

export async function updatePomodoroSettings(
  settings: PomodoroSettingsSchema
): Promise<SelectPomodoroSettings> {
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

export async function createPomodoroSession(
  session: PomodoroSessionSchema
): Promise<SelectPomodoroSession> {
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
