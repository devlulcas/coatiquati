import Database from 'better-sqlite3';
import { DATABASE_URL } from '$env/static/private';
import { join } from 'node:path';

// Temporary path to the database
const databasePath = join('data', DATABASE_URL);

// Better SQLite3
const SQLite = new Database(databasePath);
