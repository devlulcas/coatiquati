import { type z } from 'zod';
import { newTopicSchema } from './new-topic-schema';
import { topicWithIdSchema } from './topic-with-id-schema';

export const updateTopicSchema = newTopicSchema.partial().merge(topicWithIdSchema);

export type UpdateTopicSchema = z.infer<typeof updateTopicSchema>;
