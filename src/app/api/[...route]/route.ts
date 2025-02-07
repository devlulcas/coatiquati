import type { CustomContext } from '@/modules/http/types/context';
import { log } from '@/modules/logging/lib/pino';
import { toMilliseconds } from '@/shared/lib/date';
import { fail } from '@/shared/lib/result';
import { DrizzleError } from 'drizzle-orm';
import { Hono } from 'hono';
import { compress } from 'hono/compress';
import { HTTPException } from 'hono/http-exception';
import { logger as loggerMiddleware } from 'hono/logger';
import { prettyJSON } from 'hono/pretty-json';
import { requestId } from 'hono/request-id';
import { timeout } from 'hono/timeout';
import { handle } from 'hono/vercel';
import { ZodError } from 'zod';

export const dynamic = 'force-dynamic';

const app = new Hono<CustomContext>().basePath('/api');

app.use('*', requestId());
app.use(loggerMiddleware());
app.use(compress());
app.use(prettyJSON());
app.use(timeout(toMilliseconds(30, 'secs')));
app.notFound((c) => c.json(fail('Não achamos essa rota por aqui!'), 404));
// TODO: Adicionar proteção CSRF
// TODO: Adicionar proteção CORS

// Rotas
// TODO: Migrar rotas do NextJS para cá

// Error handling
app.onError((err, c) => {
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

export const GET = handle(app);
export const POST = handle(app);
export const DELETE = handle(app);
export const PUT = handle(app);
export const HEAD = handle(app);
export const OPTIONS = handle(app);
