import { integer } from 'drizzle-orm/sqlite-core';

export const createdAtColumn = integer('created_at', { mode: 'timestamp' }).notNull().default(new Date());
export const updatedAtColumn = integer('updated_at', { mode: 'timestamp' })
  .notNull()
  .default(new Date())
  .$onUpdate(() => new Date());
export const deletedAtColumn = integer('deleted_at', { mode: 'timestamp' });
export const tableTimestampColumns = {
  createdAt: createdAtColumn,
  updatedAt: updatedAtColumn,
  deletedAt: deletedAtColumn,
};
