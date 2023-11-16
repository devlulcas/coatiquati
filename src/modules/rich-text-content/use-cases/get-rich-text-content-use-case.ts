import { TopicRepository } from '@/modules/topic/repositories/topic-repository';
import type { Topic } from '@/modules/topic/types/topic';
import { TrailRepository } from '@/modules/trail/repositories/trail-repository';
import type { Trail } from '@/modules/trail/types/trail';
import { z } from 'zod';
import { ContentRepository } from '@/modules/content/repositories/content-repository';
import { RichTextContentRepository } from '@/modules/rich-text-content/repositories/rich-text-content-repository';
import type { ContentRichText } from '@/modules/content/types/content';
import { BaseContentRepository } from '@/modules/content/repositories/base-content-repository';

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

  const repository = new RichTextContentRepository(new BaseContentRepository());
  const topicRepository = new TopicRepository(new ContentRepository());
  const trailRepository = new TrailRepository();

  try {
    const [content, topic] = await Promise.all([
      repository.getContent(validatedParams.data.id),
      topicRepository.getTopicById(validatedParams.data.id),
    ]);

    const trail = await trailRepository.getTrailById(topic.trailId);

    return { content, trail, topic };
  } catch (error) {
    console.error(error);
    throw new Error('Erro ao buscar conteúdo');
  }
}
