import { protectWithSessionMiddleware } from '@/modules/auth/middleware/protect-with-session';
import { db } from '@/modules/database/db';
import type { CustomContext } from '@/modules/http/types/context';
import { log } from '@/modules/logging/lib/pino';
import { fail, isFail, ok, wrapAsyncInResult } from '@/shared/lib/result';
import { eq } from 'drizzle-orm';
import { Hono } from 'hono';
import { pomodoroSessions } from '../../database/schema/pomodoro-sessions';
import { pomodoroSettings, type PomodoroSettingsInsert } from '../../database/schema/pomodoro-settings';
import { pomodoroSessionSchema, pomodoroSettingsSchema } from '../schemas/pomodoro-schema';

export const pomodoroApp = new Hono<CustomContext>()

pomodoroApp.use('/*', protectWithSessionMiddleware);

// GET /pomodoro/settings
pomodoroApp.get('/settings', async c => {
  const user = c.get('currentUser');

  const settingsResult = await wrapAsyncInResult(
    db.select().from(pomodoroSettings).where(eq(pomodoroSettings.userId, user.id)).get(),
  );

  if (isFail(settingsResult)) {
    log.error('Error fetching pomodoro settings', { error: settingsResult });
    return c.json(fail('Error fetching pomodoro settings'), 500);
  }

  if (!settingsResult.value) {
    // Create default settings if none exist
    const defaultSettings: PomodoroSettingsInsert = {
      userId: user.id,
      pomodoroDuration: 25 * 60,
      shortBreakDuration: 5 * 60,
      longBreakDuration: 15 * 60,
      autoStartBreaks: false,
      autoStartPomodoros: false,
    };

    const createResult = await wrapAsyncInResult(
      db.insert(pomodoroSettings).values(defaultSettings).returning().get(),
    );

    if (isFail(createResult)) {
      log.error('Error creating default pomodoro settings', { error: createResult });
      return c.json(fail('Error creating default pomodoro settings'), 500);
    }

    return c.json(ok(createResult.value));
  }

  return c.json(ok(settingsResult.value));
});

// POST /pomodoro/settings
pomodoroApp.post('/settings', async c => {
  const user = c.get('currentUser');

  const body = await c.req.json();
  const validatedBody = pomodoroSettingsSchema.safeParse(body);

  if (!validatedBody.success) {
    return c.json(fail('Invalid settings data'), 400);
  }

  const settingsResult = await wrapAsyncInResult(
    db
      .insert(pomodoroSettings)
      .values({
        userId: user.id,
        ...validatedBody.data,
      })
      .onConflictDoUpdate({
        target: pomodoroSettings.userId,
        set: validatedBody.data,
      })
      .returning()
      .get(),
  );

  if (isFail(settingsResult)) {
    log.error('Error updating pomodoro settings', { error: settingsResult });
    return c.json(fail('Error updating pomodoro settings'), 500);
  }

  return c.json(ok(settingsResult.value));
});

// GET /pomodoro/sessions
pomodoroApp.get('/sessions', async c => {
  const user = c.get('currentUser');

  const sessionsResult = await wrapAsyncInResult(
    db
      .select()
      .from(pomodoroSessions)
      .where(eq(pomodoroSessions.userId, user.id))
      .orderBy(pomodoroSessions.createdAt)
      .all(),
  );

  if (isFail(sessionsResult)) {
    log.error('Error fetching pomodoro sessions', { error: sessionsResult });
    return c.json(fail('Error fetching pomodoro sessions'), 500);
  }

  return c.json(ok(sessionsResult.value));
});

// POST /pomodoro/sessions
pomodoroApp.post('/sessions', async c => {
  const user = c.get('currentUser');

  const body = await c.req.json();
  const validatedBody = pomodoroSessionSchema.safeParse(body);

  if (!validatedBody.success) {
    return c.json(fail('Invalid session data'), 400);
  }

  const sessionResult = await wrapAsyncInResult(
    db
      .insert(pomodoroSessions)
      .values({
        userId: user.id,
        startTime: new Date(validatedBody.data.startTime),
        endTime: new Date(validatedBody.data.endTime),
        type: validatedBody.data.type,
        completed: validatedBody.data.completed,
      })
      .returning()
      .get(),
  );

  if (isFail(sessionResult)) {
    log.error('Error creating pomodoro session', { error: sessionResult });
    return c.json(fail('Error creating pomodoro session'), 500);
  }

  return c.json(ok(sessionResult.value));
});



