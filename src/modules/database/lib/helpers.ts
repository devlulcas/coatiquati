import { sql } from 'drizzle-orm';
import { integer } from 'drizzle-orm/sqlite-core';

export const NOW_AS_INTEGER = sql`(strftime('%s', 'now'))`;

export const createdAtColumn = integer('createdAt', { mode: 'timestamp' }).notNull().default(NOW_AS_INTEGER);
export const updatedAtColumn = integer('updatedAt', { mode: 'timestamp' })
  .notNull()
  .default(NOW_AS_INTEGER)
  .$onUpdate(() => new Date());
export const deletedAtColumn = integer('deletedAt', { mode: 'timestamp' });

export const tableTimestampColumns = {
  createdAt: createdAtColumn,
  updatedAt: updatedAtColumn,
  deletedAt: deletedAtColumn,
};
