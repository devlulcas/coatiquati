'use server';

import type { ContentWithRichText } from '@/modules/content/types/content';
import { RichTextContentRepository } from '@/modules/rich-text-content/repositories/rich-text-content-repository';
import type { Topic } from '@/modules/topic/types/topic';
import type { Trail } from '@/modules/trail/types/trail';

export async function getRichTextContentQuery(baseContentId: number): Promise<{
  richText: ContentWithRichText;
  parentTrail: Trail;
  parentTopic: Topic;
}> {
  const richTextContentRepository = new RichTextContentRepository();

  const data = await richTextContentRepository.getByContentId(baseContentId);

  if (!data.content.topic) {
    throw new Error('Rich text content does not have a topic');
  }

  const topic = data.content.topic;
  const trail = data.content.topic.trail;

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
    id: data.content.id,
    title: data.content.title,
    active: data.content.active,
    author: data.content.author,
    contentType: 'rich_text',
    contributors: data.content.contributors,
    createdAt: data.content.createdAt,
    deletedAt: data.content.deletedAt,
    updatedAt: data.content.updatedAt,
    content: {
      id: data.id,
      baseContentId: data.baseContentId,
      asJson: data.asJson,
      contentType: 'rich_text',
      createdAt: data.createdAt,
      deletedAt: data.deletedAt,
      updatedAt: data.updatedAt,
    },
  };

  return { richText, parentTrail, parentTopic };
}
