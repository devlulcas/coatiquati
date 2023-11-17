import type { Session } from '@/modules/auth/types/session';
import { isAuthenticated } from '@/modules/auth/utils/is';
import type { ContentRichText, UpdateContent } from '@/modules/content/types/content';
import { log } from '@/modules/logging/lib/pino';
import { RichTextContentRepository } from '@/modules/rich-text-content/repositories/rich-text-content-repository';
import {
  updateRichTextContentSchema,
  type UpdateRichTextContentSchema,
} from '@/modules/rich-text-content/schemas/edit-rich-text-content-schema';

export class UpdateRichTextContentUseCase {
  constructor(
    private readonly richTextContentRepository: RichTextContentRepository = new RichTextContentRepository(),
  ) {}

  async execute(params: UpdateRichTextContentSchema, session: Session): Promise<ContentRichText> {
    if (!isAuthenticated(session)) {
      throw new Error('Usuário não autenticado.');
    }

    const validatedParams = updateRichTextContentSchema.safeParse(params);

    if (!validatedParams.success) {
      throw new Error('Parâmetros inválidos para atualizar conteúdo.');
    }

    const newBaseContent: UpdateContent = {
      contributorId: session.userId,
      id: validatedParams.data.id,
      title: validatedParams.data.title,
      topicId: validatedParams.data.topicId,
    };

    const richTextContent = await this.richTextContentRepository.updateContent(
      newBaseContent,
      validatedParams.data.content,
    );

    log.info('Conteúdo atualizado', richTextContent);

    return richTextContent;
  }
}
