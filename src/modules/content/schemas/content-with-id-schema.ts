import { z } from 'zod';

export const contentWithIdSchema = z.object({
  id: z.number({
    required_error: 'O ID do conteúdo é obrigatório.',
    invalid_type_error: 'O ID do conteúdo é um número',
  }),
});

export type ContentWithIdSchema = z.infer<typeof contentWithIdSchema>;
