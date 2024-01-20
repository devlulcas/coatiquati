import { z } from 'zod';

export const newCommentSchema = z.object({
  contentId: z.number({
    required_error: 'O id do conteúdo é obrigatório.',
    invalid_type_error: 'O id do conteúdo deve ser um número.',
  }),
  content: z
    .string({
      required_error: 'O comentário é obrigatório.',
      invalid_type_error: 'O comentário deve ser um texto.',
    })
    .min(10, {
      message: 'O comentário deve ter pelo menos 10 caracteres.',
    }),
  parentCommentId: z
    .number({ invalid_type_error: 'O id do comentário respondido deve ser um número' })
    .optional()
    .nullable(),
});

export type NewCommentSchema = z.infer<typeof newCommentSchema>;
