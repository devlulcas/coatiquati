import { z } from 'zod';

export const newContentSchema = z.object({
  topicId: z.number({ required_error: 'O id do conteúdo é obrigatório' }),
  title: z.string({ required_error: 'O título do conteúdo é obrigatório' }),
});

export type NewContentSchema = z.infer<typeof newContentSchema>;
