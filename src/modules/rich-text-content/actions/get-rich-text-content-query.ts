'use server';

import type { RichTextContent } from '@/modules/content/types/content';
import { db } from '@/modules/database/db';
import { log } from '@/modules/logging/lib/pino';
import type { Topic } from '@/modules/topic/types/topic';
import type { Trail } from '@/modules/trail/types/trail';
import { fail, isFail, ok, wrapAsyncInResult, type Result } from '@/shared/lib/result';

export async function getRichTextContentQuery(baseContentId: number): Promise<
  Result<{
    richText: RichTextContent;
    parentTrail: Trail;
    parentTopic: Topic;
  }>
> {
  const rteResult = await wrapAsyncInResult(
    db.query.contentTable.findFirst({
      where: (fields, operators) => operators.eq(fields.id, baseContentId),
      with: {
        author: true,
        contributors: { with: { user: true } },
        topic: {
          with: {
            trail: {
              with: {
                author: true,
                contributors: { with: { user: true } },
                category: true,
              },
            },
            author: true,
            contributors: { with: { user: true } },
          },
        },
      },
    }),
  );

  if (isFail(rteResult) || !rteResult.value) {
    log.error('Falha ao buscar conteúdo de texto rico', rteResult);
    return fail('Falha ao buscar conteúdo textual');
  }

  const topic = rteResult.value.topic;
  const trail = topic?.trail;

  if (!topic || !trail) {
    log.error('Falha ao buscar conteúdo de texto rico', rteResult);
    return fail('Falha ao buscar conteúdo textual');
  }

  const parentTrail: Trail = {
    id: trail.id,
    title: trail.title,
    author: trail.author,
    contributors: trail.contributors,
    category: trail.category,
    createdAt: trail.createdAt,
    deletedAt: trail.deletedAt,
    description: trail.description,
    status: trail.status,
    thumbnail: trail.thumbnail,
    updatedAt: trail.updatedAt,
  };

  const parentTopic: Topic = {
    id: topic.id,
    title: topic.title,
    author: topic.author,
    contributors: topic.contributors,
    createdAt: topic.createdAt,
    deletedAt: topic.deletedAt,
    description: topic.description,
    status: topic.status,
    thumbnail: topic.thumbnail,
    updatedAt: topic.updatedAt,
    trailId: topic.trailId,
  };

  const richText: RichTextContent = {
    id: rteResult.value.id,
    title: rteResult.value.title,
    active: rteResult.value.active,
    author: rteResult.value.author,
    contributors: rteResult.value.contributors,
    createdAt: rteResult.value.createdAt,
    deletedAt: rteResult.value.deletedAt,
    updatedAt: rteResult.value.updatedAt,
    content: rteResult.value.content,
    contentType: 'richText',
  };

  return ok({ richText, parentTrail, parentTopic });
}
