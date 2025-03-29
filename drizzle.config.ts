import { config } from 'dotenv';
import { defineConfig } from 'drizzle-kit';

config({ path: '.env.local' });

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  throw new Error('DATABASE_URL is not defined');
}

const DATABASE_AUTH_TOKEN = process.env.DATABASE_AUTH_TOKEN;
if (!DATABASE_AUTH_TOKEN) {
  throw new Error('DATABASE_AUTH_TOKEN is not defined');
}

export default defineConfig({
  dialect: 'turso',
  schema: './src/modules/database/schema/*',
  dbCredentials: {
    url: DATABASE_URL,
    authToken: DATABASE_AUTH_TOKEN,
  },
});
