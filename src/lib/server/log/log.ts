import { pino } from 'pino';

const isProduction = process.env.NODE_ENV === 'production';

const pretty = {
	target: 'pino-pretty',
	options: {
		colorize: true,
		ignore: 'pid,hostname'
	}
};

export const log = pino({
	transport: isProduction ? undefined : pretty
});
