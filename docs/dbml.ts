const sqliteGenerate = require('drizzle-dbml-generator').sqliteGenerate;
const schema = require('./src/modules/database/schema').schema;

const out = './schema.dbml';
const relational = true;

sqliteGenerate({ schema, out, relational });
