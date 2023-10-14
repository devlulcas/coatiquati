import { z } from 'zod';

export const trailWithIdSchema = z.object({
  id: z.number({
    required_error: 'O ID da trilha é obrigatório.',
    invalid_type_error: 'O ID da trilha é um número',
  }),
});

export type TrailWithIdSchema = z.infer<typeof trailWithIdSchema>;
