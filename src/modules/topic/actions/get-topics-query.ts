'use server';

import { db } from '@/modules/database/db';
import { CONTRIBUTOR_COLUMNS } from '@/modules/user/types/user';
import { ok, type Result } from '@/shared/lib/result';
import type { Topic } from '../types/topic';

export async function getTopicsQuery(
  trailId: number
): Promise<Result<Topic[]>> {
  const result = await db.query.topics.findMany({
    where: (fields, { eq, and, isNull }) => {
      return and(eq(fields.trailId, trailId), isNull(fields.deletedAt));
    },
    with: {
      user: {
        columns: CONTRIBUTOR_COLUMNS,
      },
      contributions: {
        columns: {},
        where: (fields, { isNotNull }) => {
          return isNotNull(fields.deletedAt);
        },
        with: {
          user: {
            columns: CONTRIBUTOR_COLUMNS,
          },
        },
      },
    },
  });

  const topics = result.map<Topic>((topic) => ({
    ...topic,
    author: topic.user,
    contributors: topic.contributions.map((contribution) => contribution.user),
  }));

  return ok(topics);
}
