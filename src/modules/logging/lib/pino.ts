import { env } from '@/env';
import { pino } from 'pino';

const isProduction = env.NODE_ENV === 'production';

const pretty = {
  target: 'pino-pretty',
  options: {
    colorize: true,
    ignore: 'pid,hostname',
    levelFirst: true,
  },
};

export const log = pino({
  transport: isProduction ? undefined : pretty,
});
