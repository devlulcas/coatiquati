import { imageFileSchema } from '$lib/utils/image-file-schema';
import { z } from 'zod';

const errors = {
	title: { required: 'o título é obrigatório', min: 'o título deve ter no mínimo 15 caracteres' },
	description: { required: 'a descrição é obrigatória' },
	thumbnail: { required: 'a imagem de capa é obrigatória' },
	thumbnailAlt: { required: 'o texto alternativo da imagem de capa é obrigatório' }
};

export const newTrailSchema = z.object({
  authorId: z.string(),  
	title: z.string({ required_error: errors.title.required }).min(15, { message: errors.title.min }),
	description: z.string({ required_error: errors.description.required }),
	thumbnail: imageFileSchema,
	thumbnailAlt: z.string({ required_error: errors.thumbnailAlt.required })
});

export type NewTrailSchema = z.infer<typeof newTrailSchema> 
