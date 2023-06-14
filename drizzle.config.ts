import { config } from 'dotenv';
import type { Config } from 'drizzle-kit';

config();

export default {
	schema: './src/modules/**/schemas/*',
	out: './drizzle',
	connectionString: process.env.DATABASE_URL
} satisfies Config;
