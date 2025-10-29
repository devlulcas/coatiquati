import { timestamp } from 'drizzle-orm/pg-core';

const createdAtColumn = timestamp('created_at').defaultNow().notNull();

const updatedAtColumn = timestamp('updated_at')
  .defaultNow()
  .$onUpdate(() => /* @__PURE__ */ new Date())
  .notNull();

const deletedAtColumn = timestamp('created_at');

export const tableTimestampColumns = {
  createdAt: createdAtColumn,
  updatedAt: updatedAtColumn,
  deletedAt: deletedAtColumn,
};
