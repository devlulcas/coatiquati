import { z } from 'zod';

const titleSchema = z
  .string('O título é obrigatório.')
  .min(5, 'O título deve ter pelo menos 5 caracteres.');

const descriptionSchema = z
  .string('A descrição é obrigatória.')
  .min(10, 'A descrição deve ter pelo menos 10 caracteres.');

const thumbnailSchema = z.url({
  message: 'A URL da thumbnail deve ser válida.',
});

const categoryIdSchema = z.number('A categoria é obrigatória.');

export const upsertTrailSchema = z.object({
  id: z.number().optional(),
  title: titleSchema,
  description: descriptionSchema,
  thumbnail: thumbnailSchema,
  categoryId: categoryIdSchema,
});

export type UpsertTrailSchema = z.infer<typeof upsertTrailSchema>;
