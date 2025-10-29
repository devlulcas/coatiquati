import { timestamp } from 'drizzle-orm/pg-core';

const createdAtColumn = timestamp('created_at').notNull().defaultNow();
const updatedAtColumn = timestamp('updated_at')
  .notNull()
  .defaultNow()
  .$onUpdate(() => new Date());
const deletedAtColumn = timestamp('deleted_at');

export const tableTimestampColumns = {
  createdAt: createdAtColumn,
  updatedAt: updatedAtColumn,
  deletedAt: deletedAtColumn,
};
