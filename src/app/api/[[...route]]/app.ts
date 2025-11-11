import type { CustomContext } from '@/modules/http/types/context';
import { log } from '@/modules/logging/lib/pino';
import { pomodoroApp } from '@/modules/pomodoro/http/app';
import { todoApp } from '@/modules/todo/http/app';
import { toMS } from '@/shared/lib/date';
import { fail } from '@/shared/lib/result';
import { DrizzleError } from 'drizzle-orm';
import { Hono } from 'hono';
import { compress } from 'hono/compress';
import { HTTPException } from 'hono/http-exception';
import { logger as loggerMiddleware } from 'hono/logger';
import { prettyJSON } from 'hono/pretty-json';
import { requestId } from 'hono/request-id';
import { timeout } from 'hono/timeout';
import { ZodError } from 'zod';

export const dynamic = 'force-dynamic';

const apiInformationApp = new Hono<CustomContext>().get('/', async (c) => {
  return c.json({
    name: 'CoatiQuati API',
    version: '0.1.0',
    documentation: 'https://github.com/devlulcas/coatiquati',
    timestamp: new Date().toISOString(),
    contact: {
      name: 'Lucas Alves Rego',
      url: 'https://lucasalvesrego.com',
    },
  });
});

export const app = new Hono<CustomContext>()
  .basePath('/api')
  .use('*', requestId())
  .use(loggerMiddleware())
  .use(compress())
  .use(prettyJSON())
  .use(timeout(toMS(30, 'secs')))
  .route('/', apiInformationApp)
  .route('/pomodoros', pomodoroApp)
  .route('/todos', todoApp)
  .notFound((c) => c.json(fail('Não achamos essa rota por aqui!'), 404))
  .onError((err, c) => {
    log.error(err);

    if (err instanceof HTTPException) {
      return err.getResponse();
    }

    if (err instanceof DrizzleError) {
      return c.json(fail('Algo de errado não está certo!'), 500);
    }

    if (err instanceof ZodError) {
      return c.json(fail('Verifique seus dados!'), 400);
    }

    return c.json(fail('Algo de errado não está certo!'), 500);
  });

export type AppType = typeof app;
