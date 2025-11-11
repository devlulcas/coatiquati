'use server';

import { auth } from '@/modules/auth/lib/auth';
import {
  assertAuthenticated,
  getCurrentUser,
} from '@/modules/auth/services/next';
import { upsertContent } from '@/modules/content/repositories/upsert-content';
import { db } from '@/modules/database/db';
import {
  type NewVideoContentSchema,
  newVideoContentSchema,
} from '@/modules/video-content/schemas/new-video-content-schema';
import { fail, ok, type Result } from '@/shared/lib/result';

export async function upsertVideoContentMutation(
  params: NewVideoContentSchema
): Promise<Result<number>> {
  const user = await getCurrentUser();
  assertAuthenticated(user);

  await auth.api.userHasPermission({
    body: {
      userId: user.id,
      permission: { content: ['create'] },
    },
  });

  const parsed = newVideoContentSchema.safeParse(params);

  if (!parsed.success) {
    return fail(parsed.error.message);
  }

  const contentId = await db.transaction(async (tx) => {
    const base = await upsertContent.base(tx, {
      id: parsed.data.id,
      title: params.title,
      topicId: params.topicId,
      userId: user.id,
    });

    await upsertContent.video(tx, {
      contentId: base.contentId,
      src: params.src,
    });

    return base.contentId;
  });

  return ok(contentId);
}
