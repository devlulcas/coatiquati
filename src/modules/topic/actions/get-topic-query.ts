'use server';

import { getCurrentUser } from '@/modules/auth/services/next';
import { db } from '@/modules/database/db';
import { ContentStatus } from '@/modules/database/lib/content-enum';
import { canViewAll } from '@/modules/trail/lib/can-view-all';
import { CONTRIBUTOR_COLUMNS } from '@/modules/user/types/user';
import { ok, type Result } from '@/shared/lib/result';
import { notFound } from 'next/navigation';
import type { Topic } from '../types/topic';

export async function getTopicQuery(id: number): Promise<Result<Topic>> {
  const currentUser = await getCurrentUser();
  const canViewAllTopic = await canViewAll(currentUser, 'topic');

  const result = await db.query.topics.findFirst({
    where: (fields, { eq, and, or }) => {
      const statusFilter = canViewAllTopic ? undefined : eq(fields.status, ContentStatus.PUBLISHED);

      const authorFilter = currentUser ? eq(fields.userId, currentUser.id) : undefined;

      return and(eq(fields.id, id), or(statusFilter, authorFilter));
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
      contents: {
        with: {
          user: {
            columns: CONTRIBUTOR_COLUMNS,
          },
        },
      },
    },
  });

  if (!result) {
    return notFound();
  }

  return ok({
    ...result,
    author: result.user,
    contributors: result.contributions.map(contribution => contribution.user),
  });
}
