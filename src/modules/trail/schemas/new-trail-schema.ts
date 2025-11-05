import { z } from 'zod';

const titleSchema = z
  .string({ error: 'O título deve ser um texto.' })
  .min(5, { error: 'O título deve ter pelo menos 5 caracteres.' });

const descriptionSchema = z
  .string({ error: 'A descrição deve ser um texto.' })
  .min(10, { error: 'A descrição deve ter pelo menos 10 caracteres.' });

const thumbnailSchema = z.url({
  error: 'A URL da thumbnail deve ser um texto.',
});

const categoryIdSchema = z.number({ error: 'A categoria é obrigatória.' });

export const upsertTrailSchema = z.object({
  id: z.number().optional(),
  title: titleSchema,
  description: descriptionSchema,
  thumbnail: thumbnailSchema,
  categoryId: categoryIdSchema,
});

export type UpsertTrailSchema = z.infer<typeof upsertTrailSchema>;
