import type { Session } from '@/modules/auth/types/session';
import { DrizzleContentRepository } from '../repositories/content-repository';
import { DrizzleRichTextContentRepository } from '../repositories/rich-text-content-repository';
import { newRichTextContentSchema, type NewRichTextContentSchema } from '../schemas/new-rich-text-content-schema';
import type { ContentRichText } from '../types/content';

export async function createNewRichTextContentUseCase(
  params: NewRichTextContentSchema,
  session: Session,
): Promise<ContentRichText> {
  const validatedParams = newRichTextContentSchema.safeParse(params);

  if (!validatedParams.success) {
    throw new Error('Parâmetros inválidos');
  }

  const contentRepository = new DrizzleContentRepository();
  const textContentRepository = new DrizzleRichTextContentRepository();

  const newContent = await contentRepository.createBaseContent({
    authorId: session.userId,
    contentType: 'rich_text',
    title: validatedParams.data.title,
    topicId: validatedParams.data.topicId,
  });

  const newRichTextContent = await textContentRepository.createContent({
    contentId: newContent.id,
    asJson: validatedParams.data.content,
  });

  return newRichTextContent;
}
