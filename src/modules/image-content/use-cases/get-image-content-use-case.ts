import { BaseContentRepository } from '@/modules/content/repositories/base-content-repository';
import { ContentRepository } from '@/modules/content/repositories/content-repository';
import type { ContentImage } from '@/modules/content/types/content';
import { ImageContentRepository } from '@/modules/image-content/repositories/image-content-repository';
import { TopicRepository } from '@/modules/topic/repositories/topic-repository';
import type { Topic } from '@/modules/topic/types/topic';
import { TrailRepository } from '@/modules/trail/repositories/trail-repository';
import type { Trail } from '@/modules/trail/types/trail';
import { z } from 'zod';

const getImageContentUseCaseSchema = z.object({
  id: z.number({ required_error: 'O id do conteúdo é obrigatório' }),
});

type GetImageContentUseCaseSchema = z.infer<typeof getImageContentUseCaseSchema>;

export async function getImageContentUseCase(params: GetImageContentUseCaseSchema): Promise<{
  content: ContentImage;
  trail: Trail;
  topic: Topic;
}> {
  const validatedParams = getImageContentUseCaseSchema.safeParse(params);

  if (!validatedParams.success) {
    throw new Error('Parâmetros inválidos');
  }

  const repository = new ImageContentRepository(new BaseContentRepository());
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
