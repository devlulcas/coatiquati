import { z } from 'zod';

export const newTrailCategorySchema = z.object({
  name: z
    .string({ required_error: 'Nome da categoria é obrigatório.' })
    .min(3, { message: 'Nome da categoria deve ter no mínimo 3 caracteres.' })
    .max(50, { message: 'Nome da categoria deve ter no máximo 50 caracteres.' }),
  authorId: z.string({ required_error: 'Autor da categoria é obrigatório.' }),
});

export type NewTrailCategorySchema = z.infer<typeof newTrailCategorySchema>;
