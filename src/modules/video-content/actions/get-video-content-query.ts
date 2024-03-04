'use server';

import { ContentRepository } from '@/modules/content/repositories/content-repository';
import type { ContentVideo } from '@/modules/content/types/content';
import { log } from '@/modules/logging/lib/pino';
import { TopicRepository } from '@/modules/topic/repositories/topic-repository';
import type { Topic } from '@/modules/topic/types/topic';
import { TrailRepository } from '@/modules/trail/repositories/trail-repository';
import type { Trail } from '@/modules/trail/types/trail';
import { VideoContentRepository } from '@/modules/video-content/repositories/video-content-repository';

type GetVideoContentQueryResponse = {
  content: ContentVideo;
  trail: Trail;
  topic: Topic;
};

export async function getVideoContentQuery(id: number): Promise<GetVideoContentQueryResponse> {
  const contentRepository = new ContentRepository();
  const videoContentRepository: VideoContentRepository = new VideoContentRepository();
  const topicRepository: TopicRepository = new TopicRepository(contentRepository);
  const trailRepository: TrailRepository = new TrailRepository();

  try {
    const [content, topic] = await Promise.all([
      videoContentRepository.getContent(id),
      topicRepository.getTopicById(id),
    ]);

    const trail = await trailRepository.getTrailById(topic.trailId);

    log.info('Conteúdo de vídeo buscado com sucesso', { contentId: id });

    return { content, trail, topic };
  } catch (error) {
    log.error('Erro ao buscar conteúdo de vídeo', { contentId: id });
    throw new Error('Erro ao buscar conteúdo de vídeo.');
  }
}
