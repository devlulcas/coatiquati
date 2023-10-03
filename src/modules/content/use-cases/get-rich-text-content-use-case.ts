import { z } from 'zod';

import { DrizzleRichTextContentRepository } from '../repositories/rich-text-content-repository';
import type { ContentRichText } from '../types/content';

const getRichTextContentUseCaseSchema = z.object({
  id: z.number({ required_error: 'O id do conteúdo é obrigatório' }),
});

type GetRichTextContentUseCaseSchema = z.infer<typeof getRichTextContentUseCaseSchema>;

export async function getRichTextContentUseCase(params: GetRichTextContentUseCaseSchema): Promise<ContentRichText> {
  const validatedParams = getRichTextContentUseCaseSchema.safeParse(params);

  if (!validatedParams.success) {
    throw new Error('Parâmetros inválidos');
  }

  const repository = new DrizzleRichTextContentRepository();

  try {
    return repository.getContent(validatedParams.data.id);
  } catch (error) {
    console.error(error);
    throw new Error('Erro ao buscar conteúdo');
  }
}
