import { DATABASE_URL } from '$env/static/private';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

export const pool = new Pool({
	connectionString: DATABASE_URL
});

// Top-level await não é suportado pela versão do Node.js que estamos usando como target
pool.connect();

export const db = drizzle(pool);
