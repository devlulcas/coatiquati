// import { createClient } from '@libsql/client';
// import { config } from 'dotenv';
// import { drizzle } from 'drizzle-orm/libsql';
// import { seed } from 'drizzle-seed';
// import { schema } from './schema';

// config({ path: '.env.local' });

// const DATABASE_URL = process.env.DATABASE_URL;
// if (!DATABASE_URL) throw new Error('DATABASE_URL is not defined');

// const DATABASE_AUTH_TOKEN = process.env.DATABASE_AUTH_TOKEN;
// if (!DATABASE_AUTH_TOKEN) throw new Error('DATABASE_AUTH_TOKEN is not defined');

// const sqlite = createClient({ url: DATABASE_URL, authToken: DATABASE_AUTH_TOKEN });
// const db = drizzle(sqlite);

// async function seedDatabase() {
//   await seed(db, { ...schema }, { count: 100 });
// }

// seedDatabase();
