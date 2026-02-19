import { ContentStatus } from '@/modules/database/lib/content-enum';
import { z } from 'zod';

export const newTopicSchema = z.object({
  trailId: z.number('Você precisa selecionar uma trilha para ligar a este tópico.'),
  title: z.string('O título é obrigatório.').min(5, 'O título deve ter pelo menos 5 caracteres.'),
  description: z.string('A descrição é obrigatória.').min(10, 'A descrição deve ter pelo menos 10 caracteres.'),
  thumbnail: z.url('A URL da thumbnail deve ser válida.').optional(),
  status: z.enum(ContentStatus, 'O status é obrigatório.').default(ContentStatus.DRAFT),
});

export type NewTopicSchema = z.infer<typeof newTopicSchema>;
