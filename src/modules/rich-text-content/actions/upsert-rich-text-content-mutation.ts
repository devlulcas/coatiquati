'use server';

import {
  assertAuthenticated,
  getCurrentUser,
} from '@/modules/auth/services/next';
import { upsertContent } from '@/modules/content/repositories/upsert-content';
import { db } from '@/modules/database/db';
import {
  type NewRichTextContentSchema,
  newRichTextContentSchema,
} from '@/modules/rich-text-content/schemas/new-rich-text-content-schema';
import { fail, ok, type Result } from '@/shared/lib/result';

export async function upsertRichTextContentMutation(
  params: NewRichTextContentSchema
): Promise<Result<{ contentId: number; richTextId: number }>> {
  const user = await getCurrentUser();
  assertAuthenticated(user);

  const parsed = newRichTextContentSchema.safeParse(params);

  if (!parsed.success) {
    return fail(parsed.error.message);
  }

  const [contentId, richTextId] = await db.transaction(async (tx) => {
    const base = await upsertContent.base(tx, {
      id: parsed.data.id,
      title: params.title,
      topicId: params.topicId,
      userId: user.id,
    });

    const richText = await upsertContent.richText(tx, {
      contentId: base.contentId,
      jsonContent: parsed.data.content,
    });

    return [base.contentId, richText];
  });

  return ok({ contentId, richTextId });
}
