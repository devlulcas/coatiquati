'use server';

import { db } from '@/modules/database/db';
import { fail, ok, type Result } from '@/shared/lib/result';
import { paginationSchema } from '@/shared/schemas/pagination';
import { z } from 'zod';
import {
  mapToPublicUser,
  PUBLIC_USER_COLUMNS,
  type PublicUser,
} from '../types/user';

const getUsersQuerySchema = paginationSchema.extend({
  search: z.string().optional(),
});

export async function getUsersQuery(
  params?: z.infer<typeof getUsersQuerySchema>
): Promise<Result<PublicUser[]>> {
  const parsed = getUsersQuerySchema.safeParse(params);

  if (!parsed.success) {
    return fail(parsed.error.message);
  }

  const users = await db.query.user.findMany({
    limit: parsed.data.take,
    offset: parsed.data.skip,
    columns: PUBLIC_USER_COLUMNS,
    where: (fields, operators) => {
      return operators.or(
        operators.ilike(fields.username, `%${parsed.data.search}%`)
      );
    },
  });

  return ok(users.map(mapToPublicUser));
}
