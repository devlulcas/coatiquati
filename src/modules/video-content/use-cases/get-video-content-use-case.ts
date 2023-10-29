import { DrizzleBaseContentRepository } from '@/modules/content/repositories/base-content-repository';
import { DrizzleContentRepository } from '@/modules/content/repositories/content-repository';
import type { ContentVideo } from '@/modules/content/types/content';
import { DrizzleTopicRepository } from '@/modules/topic/repositories/topic-repository';
import type { Topic } from '@/modules/topic/types/topic';
import { DrizzleTrailRepository } from '@/modules/trail/repositories/trail-repository';
import type { Trail } from '@/modules/trail/types/trail';
import { DrizzleVideoContentRepository } from '@/modules/video-content/repositories/video-content-repository';
import { z } from 'zod';

const getVideoContentUseCaseSchema = z.object({
  id: z.number({ required_error: 'O id do conteúdo é obrigatório' }),
});

type GetVideoContentUseCaseSchema = z.infer<typeof getVideoContentUseCaseSchema>;

export async function getVideoContentUseCase(params: GetVideoContentUseCaseSchema): Promise<{
  content: ContentVideo;
  trail: Trail;
  topic: Topic;
}> {
  const validatedParams = getVideoContentUseCaseSchema.safeParse(params);

  if (!validatedParams.success) {
    throw new Error('Parâmetros inválidos');
  }

  const repository = new DrizzleVideoContentRepository(new DrizzleBaseContentRepository());
  const topicRepository = new DrizzleTopicRepository(new DrizzleContentRepository());
  const trailRepository = new DrizzleTrailRepository();

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
