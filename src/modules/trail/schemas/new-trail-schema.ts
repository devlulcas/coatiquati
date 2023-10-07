import { contentStatus } from '@/shared/constants/content-status';
import { z } from 'zod';

export const newTrailSchema = z.object({
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
      required_error: 'A URL da thumbnail é obrigatória.',
      invalid_type_error: 'A URL da thumbnail deve ser um texto.',
    })
    .url({
      message: 'A URL da thumbnail deve ser válida.',
    }),
  status: z
    .enum([contentStatus.DRAFT, contentStatus.PUBLISHED], {
      required_error: 'O status é obrigatório.',
      invalid_type_error: 'O status deve ser um dos status válidos.',
    })
    .default(contentStatus.DRAFT),
  categoryId: z
    .number({
      invalid_type_error: 'O ID da categoria deve ser um número.',
    })
    .int({
      message: 'O ID da categoria deve ser um número inteiro.',
    })
    .positive({
      message: 'O ID da categoria deve ser um número positivo.',
    })
    .optional(),
});

export type NewTrailSchema = z.infer<typeof newTrailSchema>;
