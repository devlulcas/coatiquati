import { contentStatus } from '@/shared/constants/content-status';
import { z } from 'zod';

export const newTopicSchema = z.object({
  trailId: z.number({
    required_error: 'Você precisa selecionar uma trilha para ligar a este tópico.',
  }),
  title: z
    .string({
      required_error: 'O título é obrigatório.',
      invalid_type_error: 'O título deve ser um texto.',
    })
    .min(5, {
      message: 'O título deve ter pelo menos 5 caracteres.',
    }),
  description: z
    .string({
      required_error: 'A descrição é obrigatória.',
      invalid_type_error: 'A descrição deve ser um texto.',
    })
    .min(10, {
      message: 'A descrição deve ter pelo menos 10 caracteres.',
    }),
  thumbnail: z
    .string({
      invalid_type_error: 'A URL da thumbnail deve ser um texto.',
    })
    .url({
      message: 'A URL da thumbnail deve ser válida.',
    })
    .optional(),
  status: z
    .enum([contentStatus.DRAFT, contentStatus.PUBLISHED], {
      required_error: 'O status é obrigatório.',
      invalid_type_error: 'O status deve ser um dos status válidos.',
    })
    .default(contentStatus.DRAFT),
});

export type NewTopicSchema = z.infer<typeof newTopicSchema>;
