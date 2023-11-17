import type { Session } from '@/modules/auth/types/session';
import { isAuthenticated } from '@/modules/auth/utils/is';
import type { ContentRichText, NewContent } from '@/modules/content/types/content';
import { log } from '@/modules/logging/lib/pino';
import { RichTextContentRepository } from '@/modules/rich-text-content/repositories/rich-text-content-repository';
import {
  newRichTextContentSchema,
  type NewRichTextContentSchema,
} from '@/modules/rich-text-content/schemas/new-rich-text-content-schema';

export class CreateNewRichTextContentUseCase {
  constructor(
    private readonly richTextContentRepository: RichTextContentRepository = new RichTextContentRepository(),
  ) {}

  async execute(params: NewRichTextContentSchema, session: Session): Promise<ContentRichText> {
    if (!isAuthenticated(session)) {
      throw new Error('Usuários não autenticados não podem criar conteúdo.');
    }

    const validatedParams = newRichTextContentSchema.safeParse(params);

    if (!validatedParams.success) {
      throw new Error('Parâmetros inválidos para criar novo conteúdo.');
    }

    const newBaseContent: NewContent = {
      authorId: session.userId,
      contentType: 'rich_text',
      title: validatedParams.data.title,
      topicId: validatedParams.data.topicId,
    };

    const newRichTextContent = await this.richTextContentRepository.createContent(
      newBaseContent,
      validatedParams.data.content,
    );

    log.info('Novo conteúdo criado', newRichTextContent);

    return newRichTextContent;
  }
}
