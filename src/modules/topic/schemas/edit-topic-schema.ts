import { z } from 'zod';
import { newTopicSchema } from './new-topic-schema';

export const updateTopicUseCaseSchema = z.object({
  topicId: z.number({ required_error: 'O ID da trilha é obrigatório.' }),
  topic: newTopicSchema.partial(),
});

export type UpdateTopicSchema = z.infer<typeof updateTopicUseCaseSchema>;
