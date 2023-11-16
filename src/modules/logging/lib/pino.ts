import { PHASE_DEVELOPMENT_SERVER } from 'next/dist/shared/lib/constants';
import { pino } from 'pino';

const pretty = {
  target: 'pino-pretty',
  options: {
    colorize: true,
    ignore: 'pid,hostname',
    levelFirst: true,
  },
};

export const log = pino({
  transport: PHASE_DEVELOPMENT_SERVER ? undefined : pretty,
});
