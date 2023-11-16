import type { Session } from '@/modules/auth/types/session';
import { isAuthenticated } from '@/modules/auth/utils/is';
import { BaseContentRepository } from '@/modules/content/repositories/base-content-repository';
import type { ContentRichText, NewContent } from '@/modules/content/types/content';
import { RichTextContentRepository } from '@/modules/rich-text-content/repositories/rich-text-content-repository';
import {
  newRichTextContentSchema,
  type NewRichTextContentSchema,
} from '@/modules/rich-text-content/schemas/new-rich-text-content-schema';

export async function createNewRichTextContentUseCase(
  params: NewRichTextContentSchema,
  session: Session,
): Promise<ContentRichText> {
  if (!isAuthenticated(session)) {
    throw new Error('Usuário não autenticado');
  }

  const validatedParams = newRichTextContentSchema.safeParse(params);

  if (!validatedParams.success) {
    throw new Error('Parâmetros inválidos');
  }

  const repository = new RichTextContentRepository(new BaseContentRepository());

  const newBaseContent: NewContent = {
    authorId: session.userId,
    contentType: 'rich_text',
    title: validatedParams.data.title,
    topicId: validatedParams.data.topicId,
  };

  const newRichTextContent = await repository.createContent(newBaseContent, validatedParams.data.content);

  return newRichTextContent;
}
