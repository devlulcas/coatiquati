import type { Session } from '@/modules/auth/types/session';
import { DrizzleRichTextContentRepository } from '../repositories/rich-text-content-repository';
import type { ContentRichText, NewContent, UpdateContent } from '../types/content';
import {
  updateRichTextContentSchema,
  type UpdateRichTextContentSchema,
} from '../schemas/edit-rich-text-content-schema';
import { DrizzleBaseContentRepository } from '../repositories/base-content-repository';

export async function updateRichTextContentUseCase(
  params: UpdateRichTextContentSchema,
  session: Session,
): Promise<ContentRichText> {
  const validatedParams = updateRichTextContentSchema.safeParse(params);

  if (!validatedParams.success) {
    throw new Error('Parâmetros inválidos');
  }

  const repository = new DrizzleRichTextContentRepository(new DrizzleBaseContentRepository());

  const newBaseContent: UpdateContent = {
    contributorId: session.userId,
    id: validatedParams.data.id,
    title: validatedParams.data.title,
    topicId: validatedParams.data.topicId,
  };

  const newRichTextContent = await repository.updateContent(newBaseContent, validatedParams.data.content);

  return newRichTextContent;
}
