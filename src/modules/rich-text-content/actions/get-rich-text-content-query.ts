'use server';

import type { ContentWithRichText } from '@/modules/content/types/content';
import { log } from '@/modules/logging/lib/pino';
import { RichTextContentRepository } from '@/modules/rich-text-content/repositories/rich-text-content-repository';
import type { Topic } from '@/modules/topic/types/topic';
import type { Trail } from '@/modules/trail/types/trail';
import { fail, ok, wrapAsyncInResult, type Result } from '@/shared/lib/result';

export async function getRichTextContentQuery(baseContentId: number): Promise<
  Result<{
    richText: ContentWithRichText;
    parentTrail: Trail;
    parentTopic: Topic;
  }>
> {
  const richTextContentRepository = new RichTextContentRepository();

  const rteResult = await wrapAsyncInResult(richTextContentRepository.getByContentId(baseContentId));

  if (rteResult.type === 'fail') {
    log.error('Falha ao buscar conteúdo de texto rico', rteResult.fail);
    return fail('Falha ao buscar conteúdo textual');
  }

  if (!rteResult.value.content.topic) {
    log.error('Conteúdo não está associado a um tópico', rteResult.value);
    return fail('Conteúdo não está associado a um tópico');
  }

  const topic = rteResult.value.content.topic;
  const trail = rteResult.value.content.topic.trail;

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

  const richText: ContentWithRichText = {
    id: rteResult.value.content.id,
    title: rteResult.value.content.title,
    active: rteResult.value.content.active,
    author: rteResult.value.content.author,
    contentType: 'rich_text',
    contributors: rteResult.value.content.contributors,
    createdAt: rteResult.value.content.createdAt,
    deletedAt: rteResult.value.content.deletedAt,
    updatedAt: rteResult.value.content.updatedAt,
    content: {
      id: rteResult.value.id,
      baseContentId: rteResult.value.baseContentId,
      asJson: rteResult.value.asJson,
      contentType: 'rich_text',
      createdAt: rteResult.value.createdAt,
      deletedAt: rteResult.value.deletedAt,
      updatedAt: rteResult.value.updatedAt,
    },
  };

  return ok({ richText, parentTrail, parentTopic });
}
