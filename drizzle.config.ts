import { config } from 'dotenv';
import type { Config } from 'drizzle-kit';

config({
  path: '.env.local',
});

const DATABASE_URL = process.env.DATABASE_URL;
const DATABASE_AUTH_TOKEN = process.env.DATABASE_AUTH_TOKEN;
if (!DATABASE_URL) {
  throw new Error('DATABASE_URL is not defined');
}
if (!DATABASE_AUTH_TOKEN) {
  throw new Error('DATABASE_AUTH_TOKEN is not defined');
}

export default {
  schema: './src/modules/database/schema/*',
  out: './drizzle',
  driver: 'turso',
  dbCredentials: {
    url: DATABASE_URL,
    authToken: DATABASE_AUTH_TOKEN,
  },
} satisfies Config;
