import { config } from 'dotenv';
import { drizzle } from 'drizzle-orm/node-postgres';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import pg from 'pg';

config();

const { Client } = pg;

const client = new Client({
	connectionString: process.env.DATABASE_URL
});

// Top-level await não é suportado pela versão do Node.js que estamos usando como target
client.connect().then(() => {
	const migrationDb = drizzle(client);

	migrate(migrationDb, {
		migrationsFolder: './drizzle'
	})
		.then(() => {
			console.log('Migration complete!');
			client.end();
		})
		.catch((err) => {
			console.error(err);
			client.end();
		});
});
