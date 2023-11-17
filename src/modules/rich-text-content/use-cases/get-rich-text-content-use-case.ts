import type { ContentRichText } from '@/modules/content/types/content';
import { RichTextContentRepository } from '@/modules/rich-text-content/repositories/rich-text-content-repository';
import { TopicRepository } from '@/modules/topic/repositories/topic-repository';
import type { Topic } from '@/modules/topic/types/topic';
import { TrailRepository } from '@/modules/trail/repositories/trail-repository';
import type { Trail } from '@/modules/trail/types/trail';
import { z } from 'zod';

const getRichTextContentUseCaseSchema = z.object({
  id: z.number({ required_error: 'O id do conteúdo é obrigatório' }),
});

type GetRichTextContentUseCaseSchema = z.infer<typeof getRichTextContentUseCaseSchema>;

type GetRichTextContentUseCaseReturn = {
  content: ContentRichText;
  trail: Trail;
  topic: Topic;
};

export class GetRichTextContentUseCase {
  constructor(
    private readonly richTextContentRepository: RichTextContentRepository = new RichTextContentRepository(),
    private readonly topicRepository: TopicRepository = new TopicRepository(),
    private readonly trailRepository: TrailRepository = new TrailRepository(),
  ) {}

  async execute(params: GetRichTextContentUseCaseSchema): Promise<GetRichTextContentUseCaseReturn> {
    const validatedParams = getRichTextContentUseCaseSchema.safeParse(params);

    if (!validatedParams.success) {
      throw new Error('Parâmetros inválidos para buscar conteúdo.');
    }

    try {
      const [content, topic] = await Promise.all([
        this.richTextContentRepository.getContent(validatedParams.data.id),
        this.topicRepository.getTopicById(validatedParams.data.id),
      ]);

      const trail = await this.trailRepository.getTrailById(topic.trailId);
      return { content, trail, topic };
    } catch (error) {
      console.error(error);
      throw new Error('Erro ao buscar conteúdo.');
    }
  }
}
