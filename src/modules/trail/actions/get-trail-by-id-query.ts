'use server';

import { getCurrentUser } from '@/modules/auth/services/next';
import { db } from '@/modules/database/db';
import { ContentStatus } from '@/modules/database/schema/content';
import { ok, type Result } from '@/shared/lib/result';
import { notFound } from 'next/navigation';
import { canViewAllTrails } from '../lib/can-view-any-contribution';
import { mapToTrail, TRAIL_QUERY, type Trail } from '../types/trail';

export async function getTrailByIdQuery(id: number): Promise<Result<Trail>> {
  const currentUser = await getCurrentUser();
  const canViewAll = await canViewAllTrails(currentUser);

  const result = await db.query.trails.findFirst({
    ...TRAIL_QUERY,
    where: (fields, { eq, and, or }) => {
      const statusFilter = canViewAll
        ? undefined
        : eq(fields.status, ContentStatus.PUBLISHED);

      const authorFilter = currentUser
        ? eq(fields.authorId, currentUser.id)
        : undefined;

      return and(eq(fields.id, id), or(statusFilter, authorFilter));
    },
  });

  if (!result) {
    return notFound();
  }

  return ok(mapToTrail(result));
}
