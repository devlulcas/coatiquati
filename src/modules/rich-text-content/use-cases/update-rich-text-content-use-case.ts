import type { Session } from '@/modules/auth/types/session';
import { isAuthenticated } from '@/modules/auth/utils/is';
import { DrizzleBaseContentRepository } from '@/modules/content/repositories/base-content-repository';
import type { ContentRichText, UpdateContent } from '@/modules/content/types/content';
import { DrizzleRichTextContentRepository } from '@/modules/rich-text-content/repositories/rich-text-content-repository';
import {
  updateRichTextContentSchema,
  type UpdateRichTextContentSchema,
} from '@/modules/rich-text-content/schemas/edit-rich-text-content-schema';

export async function updateRichTextContentUseCase(
  params: UpdateRichTextContentSchema,
  session: Session,
): Promise<ContentRichText> {
  if (!isAuthenticated(session)) {
    throw new Error('Usuário não autenticado');
  }

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
