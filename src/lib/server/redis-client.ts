import { REDIS_USERNAME, REDIS_PASSWORD, REDIS_HOST, REDIS_PORT } from '$env/static/private';
import { createClient } from 'redis';
import { z } from 'zod';

const configSchema = z.object({
	username: z.string(),
	password: z.string(),
	host: z.string(),
	port: z.string()
});

const config = configSchema.parse({
	username: REDIS_USERNAME,
	password: REDIS_PASSWORD,
	host: REDIS_HOST,
	port: REDIS_PORT
});

const redisClient = createClient({
	url: `redis://${config.username}:${config.password}@${config.host}:${config.port}`
});

redisClient.on('error', (error) => {
	console.error(error);
});

await redisClient.connect();

export class RedisClient {
	public client = redisClient;
}

process.on('SIGINT', () => {
	redisClient.disconnect();
});
