'use server';

import {
  assertAuthenticated,
  getCurrentUser,
} from '@/modules/auth/services/next';
import { upsertContent } from '@/modules/content/repositories/upsert-content';
import { db } from '@/modules/database/db';
import {
  newImageContentSchema,
  type NewImageContentSchema,
} from '@/modules/image-content/schemas/new-image-content-schema';
import { fail, wrapAsyncInResult, type Result } from '@/shared/lib/result';

export async function upsertImageContentMutation(
  params: NewImageContentSchema
): Promise<Result<number>> {
  const user = await getCurrentUser();
  assertAuthenticated(user);

  const parsed = newImageContentSchema.safeParse(params);

  if (!parsed.success) {
    return fail(parsed.error.message);
  }

  const contentId = await wrapAsyncInResult(
    db.transaction(async (tx) => {
      const base = await upsertContent.base(tx, {
        title: params.title,
        userId: user.id,
        id: parsed.data.id,
        topicId: params.topicId,
        description: params.description,
      });

      await upsertContent.image(tx, {
        contentId: base.contentId,
        src: params.src,
        alt: params.alt,
      });

      return base.contentId;
    })
  );

  return contentId;
}
