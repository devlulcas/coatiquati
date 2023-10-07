import { z } from 'zod';
import { newTopicSchema } from './new-topic-schema';

export const updateTopicUseCaseSchema = newTopicSchema.partial().merge(
  z.object({
    id: z.number({
      required_error: 'O ID do tópico é obrigatório.',
      invalid_type_error: 'O ID do tópico deve ser um número.',
    }),
  }),
);

export type UpdateTopicSchema = z.infer<typeof updateTopicUseCaseSchema>;
