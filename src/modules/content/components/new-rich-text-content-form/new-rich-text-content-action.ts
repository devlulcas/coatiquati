'use server';

import { getActionSession } from '@/modules/auth/utils/get-action-session';
import type { NewRichTextContentSchema } from '../../schemas/new-rich-text-content-schema';
import { createNewRichTextContentUseCase } from '../../use-cases/create-new-rich-text-content-use-case';

export async function newRichTextContentAction(data: NewRichTextContentSchema) {
  const session = await getActionSession();

  if (!session) {
    throw new Error('Você precisa estar logado para criar um conteúdo.');
  }

  await createNewRichTextContentUseCase(data, session);
}
