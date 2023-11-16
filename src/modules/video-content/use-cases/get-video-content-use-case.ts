import { ContentRepository } from '@/modules/content/repositories/content-repository';
import type { ContentVideo } from '@/modules/content/types/content';
import { log } from '@/modules/logging/lib/pino';
import { TopicRepository } from '@/modules/topic/repositories/topic-repository';
import type { Topic } from '@/modules/topic/types/topic';
import { TrailRepository } from '@/modules/trail/repositories/trail-repository';
import type { Trail } from '@/modules/trail/types/trail';
import { VideoContentRepository } from '@/modules/video-content/repositories/video-content-repository';
import { z } from 'zod';

const getVideoContentUseCaseSchema = z.object({
  id: z.number({ required_error: 'O id do conteúdo é obrigatório' }),
});

type GetVideoContentUseCaseSchema = z.infer<typeof getVideoContentUseCaseSchema>;

export class GetVideoContentUseCase {
  constructor(
    private readonly videoContentRepository: VideoContentRepository = new VideoContentRepository(),
    private readonly topicRepository: TopicRepository = new TopicRepository(new ContentRepository()),
    private readonly trailRepository: TrailRepository = new TrailRepository(),
  ) {}

  async execute(params: GetVideoContentUseCaseSchema): Promise<{
    content: ContentVideo;
    trail: Trail;
    topic: Topic;
  }> {
    const validatedParams = getVideoContentUseCaseSchema.safeParse(params);

    if (!validatedParams.success) {
      throw new Error('Parâmetros inválidos para busca de vídeos.');
    }

    try {
      const [content, topic] = await Promise.all([
        this.videoContentRepository.getContent(validatedParams.data.id),
        this.topicRepository.getTopicById(validatedParams.data.id),
      ]);

      const trail = await this.trailRepository.getTrailById(topic.trailId);

      log.info('Conteúdo de vídeo buscado com sucesso', { contentId: validatedParams.data.id });

      return { content, trail, topic };
    } catch (error) {
      log.error('Erro ao buscar conteúdo de vídeo', { contentId: validatedParams.data.id });
      throw new Error('Erro ao buscar conteúdo de vídeo.');
    }
  }
}
