import { z } from 'zod';

import { DrizzleTopicRepository } from '@/modules/topic/repositories/topic-repository';
import type { Topic } from '@/modules/topic/types/topic';
import { DrizzleTrailRepository } from '@/modules/trail/repositories/trail-repository';
import type { Trail } from '@/modules/trail/types/trail';
import { DrizzleContentRepository } from '../repositories/content-repository';
import { DrizzleRichTextContentRepository } from '../repositories/rich-text-content-repository';
import type { ContentRichText } from '../types/content';

const getRichTextContentUseCaseSchema = z.object({
  id: z.number({ required_error: 'O id do conteúdo é obrigatório' }),
});

type GetRichTextContentUseCaseSchema = z.infer<typeof getRichTextContentUseCaseSchema>;

export async function getRichTextContentUseCase(params: GetRichTextContentUseCaseSchema): Promise<{
  content: ContentRichText;
  trail: Trail;
  topic: Topic;
}> {
  const validatedParams = getRichTextContentUseCaseSchema.safeParse(params);

  if (!validatedParams.success) {
    throw new Error('Parâmetros inválidos');
  }

  const textContentRepository = new DrizzleRichTextContentRepository();
  const topicRepository = new DrizzleTopicRepository(new DrizzleContentRepository());
  const trailRepository = new DrizzleTrailRepository();

  try {
    const [content, topic] = await Promise.all([
      textContentRepository.getContent(validatedParams.data.id),
      topicRepository.getTopicById(validatedParams.data.id),
    ]);

    const trail = await trailRepository.getTrailById(topic.trailId);

    return { content, trail, topic };
  } catch (error) {
    console.error(error);
    throw new Error('Erro ao buscar conteúdo');
  }
}
