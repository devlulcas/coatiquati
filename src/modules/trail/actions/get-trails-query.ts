'use server';

import { getCurrentUser } from '@/modules/auth/services/next';
import { db } from '@/modules/database/db';
import { ContentStatus } from '@/modules/database/schema/content';
import { fail, ok, type Result } from '@/shared/lib/result';
import { paginationSchema } from '@/shared/schemas/pagination';
import type { SQL } from 'drizzle-orm';
import { z } from 'zod';
import { canViewAllTrails } from '../lib/can-view-any-contribution';
import { mapToTrail, TRAIL_QUERY, type Trail } from '../types/trail';

const trailSearchSchema = z
  .object({
    search: z.coerce.string().optional(),
    category: z.number().optional(),
    authorId: z.string().optional(),
    status: z.enum(ContentStatus).optional(),
  })
  .extend(paginationSchema.shape);

export type TrailSearchSchema = z.infer<typeof trailSearchSchema>;

export async function getTrailsQuery(
  params?: TrailSearchSchema
): Promise<Result<Trail[]>> {
  const parsed = trailSearchSchema.safeParse(params);

  if (!parsed.success) {
    return fail(parsed.error.message);
  }

  const currentUser = await getCurrentUser();
  const canViewAll = await canViewAllTrails(currentUser);

  const result = await db.query.trails.findMany({
    ...TRAIL_QUERY,
    where: (fields, { eq, and, or, ilike }) => {
      const authorFilter = currentUser
        ? eq(fields.authorId, currentUser.id)
        : undefined;

      const filters: SQL[] = [eq(fields.status, ContentStatus.PUBLISHED)];

      if (canViewAll && parsed.data.status) {
        filters.shift();
        filters.push(eq(fields.status, parsed.data.status));
      }

      if (parsed.data.search) {
        filters.push(ilike(fields.title, `%${parsed.data.search}%`));
      }

      if (parsed.data.category) {
        filters.push(eq(fields.categoryId, parsed.data.category));
      }

      if (parsed.data.authorId) {
        filters.push(eq(fields.authorId, parsed.data.authorId));
      }

      return and(...filters, or(authorFilter));
    },
  });

  return ok(result.map(mapToTrail));
}
