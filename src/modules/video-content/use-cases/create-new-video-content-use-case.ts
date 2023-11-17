import type { Session } from '@/modules/auth/types/session';
import type { ContentVideo, NewContent } from '@/modules/content/types/content';
import { log } from '@/modules/logging/lib/pino';
import { VideoContentRepository } from '@/modules/video-content/repositories/video-content-repository';
import {
  newVideoContentSchema,
  type NewVideoContentSchema,
} from '@/modules/video-content/schemas/new-video-content-schema';

export class CreateNewVideoContentUseCase {
  constructor(private readonly videoContentRepository: VideoContentRepository = new VideoContentRepository()) {}

  async execute(params: NewVideoContentSchema, session: Session): Promise<ContentVideo> {
    const validatedParams = newVideoContentSchema.safeParse(params);

    if (!validatedParams.success) {
      throw new Error('Parâmetros inválidos para cadastro de conteúdo de vídeo.');
    }

    const newBaseContent: NewContent = {
      authorId: session.userId,
      contentType: 'video',
      title: validatedParams.data.title,
      topicId: validatedParams.data.topicId,
    };

    const newVideoContent = await this.videoContentRepository.createContent(newBaseContent, validatedParams.data);

    log.info('Conteúdo de vídeo criado com sucesso', { contentId: newVideoContent.contentId, userId: session.userId });

    return newVideoContent;
  }
}
