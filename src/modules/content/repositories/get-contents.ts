'use server';

import { getCurrentUser } from '@/modules/auth/services/next';
import { db } from '@/modules/database/db';
import { ContentStatus } from '@/modules/database/schema/content';
import { canViewAll } from '@/modules/trail/lib/can-view-all';
import { CONTRIBUTOR_COLUMNS } from '@/modules/user/types/user';
import { ok, type Result } from '@/shared/lib/result';
import { notFound } from 'next/navigation';
import type { BaseContent } from '../types/content';

type GetContentsQueryParams = {
  topicId: number;
};

export async function getContentsQuery(
  params: GetContentsQueryParams
): Promise<Result<BaseContent[]>> {
  const currentUser = await getCurrentUser();
  const canViewAllTopic = await canViewAll(currentUser, 'topic');

  const result = await db.query.contents.findMany({
    where: (fields, { eq, and, or }) => {
      const statusFilter = canViewAllTopic
        ? undefined
        : eq(fields.status, ContentStatus.PUBLISHED);

      const authorFilter = currentUser
        ? eq(fields.userId, currentUser.id)
        : undefined;

      return and(
        eq(fields.topicId, params.topicId),
        or(statusFilter, authorFilter)
      );
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
      imageContent: true,
      richTextContent: true,
      videoContent: true,
    },
  });

  if (!result) {
    return notFound();
  }

  const contents = result.map((content) => ({
    ...content,
    author: content.user,
    contributors: content.contributions.map(
      (contribution) => contribution.user
    ),
  }));

  return ok(contents);
}
