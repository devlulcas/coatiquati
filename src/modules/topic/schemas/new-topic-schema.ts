import { z } from 'zod';

export const newTopicSchema = z.object({
  trailId: z.number({
    required_error: 'Você precisa selecionar uma trilha.',
  }),
  title: z.string().min(5, {
    message: 'O título deve ter pelo menos 5 caracteres.',
  }),
  description: z.string().min(10, {
    message: 'A descrição deve ter pelo menos 10 caracteres.',
  }),
});

export type NewTopicSchema = z.infer<typeof newTopicSchema>;
