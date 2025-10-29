import { z } from 'zod';

export const newContentSchema = z.object({
  id: z.number().optional(),
  topicId: z.number({ required_error: 'O id do conteúdo é obrigatório' }),
  title: z.string({ required_error: 'O título do conteúdo é obrigatório' }),
});

type NewContentSchema = z.infer<typeof newContentSchema>;
