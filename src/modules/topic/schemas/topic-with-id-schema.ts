import { z } from 'zod';

export const topicWithIdSchema = z.object({
  id: z.number('O ID do tópico é obrigatório.'),
});
