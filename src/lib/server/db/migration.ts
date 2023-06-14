import { config } from 'dotenv';
import { drizzle } from 'drizzle-orm/node-postgres';
import { migrate } from 'drizzle-orm/node-postgres/migrator';

config();

// Por algum motivo, o import direto do módulo não funciona
// talvez seja por causa do ESM, talvez seja por causa do TSX sendo usado para executar o script
// ao invés do ESBUILD
// TODO: Investigar o motivo do import direto não funcionar
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import PG from 'pg/lib/index.js';

const client = new PG.Client({
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
