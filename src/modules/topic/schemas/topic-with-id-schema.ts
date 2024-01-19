import { z } from 'zod';

export const topicWithIdSchema = z.object({
  id: z.number({
    required_error: 'O ID do tópico é obrigatório.',
    invalid_type_error: 'O ID do tópico é um número',
  }),
});

export type TopicWithIdSchema = z.infer<typeof topicWithIdSchema>;
