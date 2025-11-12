import { PublicationMediaType } from '@/modules/database/schema/publication-media';
import { z } from 'zod';

const publicationMediaSchema = z.object({
  description: z
    .string('A descrição é obrigatória')
    .min(1, 'A descrição é obrigatória')
    .max(100, 'A descrição deve ter no máximo 100 caracteres'),
  url: z
    .url('A URL é obrigatória')
    .min(1, 'A URL é obrigatória')
    .max(255, 'A URL deve ter no máximo 255 caracteres'),
  type: z.enum(PublicationMediaType, 'O tipo de mídia é obrigatório'),
});

export const createPublicationSchema = z.object({
  content: z
    .string('O conteúdo é obrigatório')
    .min(1, 'O conteúdo é obrigatório')
    .max(1000, 'O conteúdo deve ter no máximo 1000 caracteres'),
  medias: z
    .array(publicationMediaSchema, 'As mídias devem ser um array')
    .max(4, 'Você pode adicionar no máximo 4 mídias')
    .default([]),
});

export type CreatePublicationSchema = z.infer<typeof createPublicationSchema>;
