import { z } from 'zod';

export const newTrailSchema = z.object({
  title: z.string().min(5, {
    message: 'O título deve ter pelo menos 5 caracteres.',
  }),
  description: z.string().min(10, {
    message: 'A descrição deve ter pelo menos 10 caracteres.',
  }),
  thumbnail: z.string().url({
    message: 'A URL da thumbnail deve ser válida.',
  }),
  status: z.enum(['published', 'draft']).default('draft'),
});
