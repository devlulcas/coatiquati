import { sql } from 'drizzle-orm';
import { integer } from 'drizzle-orm/sqlite-core';

const NOW_AS_INTEGER = sql`(strftime('%s', 'now'))`;

const createdAtColumn = integer('created_at', { mode: 'timestamp' }).notNull().default(NOW_AS_INTEGER);
const updatedAtColumn = integer('updated_at', { mode: 'timestamp' })
  .notNull()
  .default(NOW_AS_INTEGER)
  .$onUpdate(() => new Date());
const deletedAtColumn = integer('deleted_at', { mode: 'timestamp' });

export const tableTimestampColumns = {
  createdAt: createdAtColumn,
  updatedAt: updatedAtColumn,
  deletedAt: deletedAtColumn,
};
