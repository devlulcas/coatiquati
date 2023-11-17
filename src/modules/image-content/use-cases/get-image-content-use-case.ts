import type { ContentImage } from '@/modules/content/types/content';
import { ImageContentRepository } from '@/modules/image-content/repositories/image-content-repository';
import { log } from '@/modules/logging/lib/pino';
import { TopicRepository } from '@/modules/topic/repositories/topic-repository';
import type { Topic } from '@/modules/topic/types/topic';
import { TrailRepository } from '@/modules/trail/repositories/trail-repository';
import type { Trail } from '@/modules/trail/types/trail';
import { z } from 'zod';

const getImageContentUseCaseSchema = z.object({
  id: z.number({ required_error: 'O id do conteúdo é obrigatório' }),
});

type GetImageContentUseCaseSchema = z.infer<typeof getImageContentUseCaseSchema>;

type GetImageContentUseCaseResult = {
  content: ContentImage;
  trail: Trail;
  topic: Topic;
};

export class GetImageContentUseCase {
  constructor(
    private readonly imageContentRepository: ImageContentRepository = new ImageContentRepository(),
    private readonly topicRepository: TopicRepository = new TopicRepository(),
    private readonly trailRepository: TrailRepository = new TrailRepository(),
  ) {}

  async execute(params: GetImageContentUseCaseSchema): Promise<GetImageContentUseCaseResult> {
    const validatedParams = getImageContentUseCaseSchema.safeParse(params);

    if (!validatedParams.success) {
      throw new Error('Parâmetros inválidos para buscar conteúdo de imagem.');
    }

    try {
      const [content, topic] = await Promise.all([
        this.imageContentRepository.getContent(validatedParams.data.id),
        this.topicRepository.getTopicById(validatedParams.data.id),
      ]);

      const trail = await this.trailRepository.getTrailById(topic.trailId);

      return { content, trail, topic };
    } catch (error) {
      log.error('Erro ao buscar conteúdo de imagem.', { error, params });
      throw new Error('Erro ao buscar conteúdo');
    }
  }
}
