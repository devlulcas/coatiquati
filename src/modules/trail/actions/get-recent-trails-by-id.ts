'use server';

import { db } from '@/modules/database/db';
import { ContentStatus } from '@/modules/database/lib/content-enum';
import { ok, type Result } from '@/shared/lib/result';
import { mapToTrail, TRAIL_QUERY, type Trail } from '../types/trail';

export async function getRecentTrailsQuery(): Promise<Result<Trail[]>> {
  const quantity = 20;

  const result = await db.query.trails.findMany({
    ...TRAIL_QUERY,
    limit: quantity,
    where: (fields, { eq, and, isNull }) => {
      return and(eq(fields.status, ContentStatus.PUBLISHED), isNull(fields.deletedAt));
    },
    orderBy: (fields, { desc }) => {
      return desc(fields.createdAt);
    },
  });

  return ok(result.map(mapToTrail));
}
