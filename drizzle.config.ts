import type { Config } from 'drizzle-kit';
import { readFileSync } from 'node:fs';

// I just don't want to deal with dotenv right now
const databaseUrl = readFileSync('.env.local', 'utf-8')
  .split('\n')
  .find((line) => line.startsWith('DATABASE'))
  ?.match(/DATABASE_URL = "(.*)"/)?.[1];

if (!databaseUrl) {
  throw new Error('DATABASE_URL not found in .env');
}

export default {
  schema: './src/modules/database/schema/*',
  out: './drizzle',
  driver: 'better-sqlite',
  dbCredentials: {
    url: databaseUrl,
  },
} satisfies Config;
