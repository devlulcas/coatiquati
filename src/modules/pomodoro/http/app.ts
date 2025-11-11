import { protectWithSessionMiddleware } from '@/modules/auth/middleware/protect-with-session';
import { db } from '@/modules/database/db';
import type { CustomContext } from '@/modules/http/types/context';
import { fail, ok } from '@/shared/lib/result';
import { eq } from 'drizzle-orm';
import { Hono } from 'hono';
import { pomodoroSessions } from '../../database/schema/pomodoro-sessions';
import {
  pomodoroSettings,
  type InsertPomodoroSettings,
} from '../../database/schema/pomodoro-settings';
import {
  pomodoroSessionSchema,
  pomodoroSettingsSchema,
} from '../schemas/pomodoro-schema';

const pomodoroSettingsApp = new Hono<CustomContext>()
  .get('/', async (c) => {
    const user = c.get('currentUser');

    const settings = await db
      .select()
      .from(pomodoroSettings)
      .where(eq(pomodoroSettings.userId, user.id))
      .limit(1)
      .then((rows) => rows.at(0));

    if (!settings) {
      const defaultSettings: InsertPomodoroSettings = {
        userId: user.id,
        pomodoroDuration: 25 * 60,
        shortBreakDuration: 5 * 60,
        longBreakDuration: 15 * 60,
        autoStartBreaks: false,
        autoStartPomodoros: false,
      };

      const createResult = await db
        .insert(pomodoroSettings)
        .values(defaultSettings)
        .returning()
        .then((rows) => rows.at(0));

      if (!createResult) {
        return c.json(
          fail('Erro ao criar configurações padrão de pomodoro'),
          500
        );
      }

      return c.json(ok(createResult));
    }
  })
  .put('/', async (c) => {
    const user = c.get('currentUser');
    const body = await c.req.json();
    const parsed = pomodoroSettingsSchema.safeParse(body);

    if (!parsed.success) {
      return c.json(fail('Dados de configurações inválidos'), 400);
    }

    const settings = await db
      .insert(pomodoroSettings)
      .values({
        userId: user.id,
        ...parsed.data,
      })
      .onConflictDoUpdate({
        target: pomodoroSettings.userId,
        set: parsed.data,
      })
      .returning()
      .then((rows) => rows.at(0));

    if (!settings) {
      return c.json(fail('Erro ao modificar configurações de pomodoro'), 500);
    }

    return c.json(ok(settings));
  });

const pomodoroSessionsApp = new Hono<CustomContext>()
  .get('/', async (c) => {
    const user = c.get('currentUser');

    const sessions = await db
      .select()
      .from(pomodoroSessions)
      .where(eq(pomodoroSessions.userId, user.id))
      .orderBy(pomodoroSessions.createdAt);

    return c.json(ok(sessions));
  })
  .post('/', async (c) => {
    const user = c.get('currentUser');
    const body = await c.req.json();
    const parsed = pomodoroSessionSchema.safeParse(body);

    if (!parsed.success) {
      return c.json(fail('Dados de sessão inválidos'), 400);
    }

    const session = await db
      .insert(pomodoroSessions)
      .values({
        startTime: parsed.data.startTime,
        endTime: parsed.data.endTime,
        type: parsed.data.type,
        completed: parsed.data.completed,
        userId: user.id,
      })
      .returning()
      .then((rows) => rows.at(0));

    if (!session) {
      return c.json(fail('Erro ao criar sessão de pomodoro'), 500);
    }

    return c.json(ok(session));
  });

export const pomodoroApp = new Hono<CustomContext>()
  .use('/*', protectWithSessionMiddleware)
  .route('/settings', pomodoroSettingsApp)
  .route('/sessions', pomodoroSessionsApp);
