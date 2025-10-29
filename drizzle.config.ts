import { config } from 'dotenv';

config({ path: '.env.local' });

import { defineConfig } from 'drizzle-kit';

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  throw new Error('DATABASE_URL is not defined');
}

export default defineConfig({
  dialect: 'postgresql',
  schema: './src/modules/database/schema/*',
  dbCredentials: {
    url: DATABASE_URL,
  },
});
