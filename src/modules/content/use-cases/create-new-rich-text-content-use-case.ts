import type { Session } from '@/modules/auth/types/session';
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

  const repository = new DrizzleRichTextContentRepository();

  const newRichTextContent = await repository.createContent(
    {
      authorId: session.userId,
      contentType: 'rich_text',
      title: validatedParams.data.title,
      topicId: validatedParams.data.topicId,
    },
    validatedParams.data.content,
  );

  return newRichTextContent;
}
