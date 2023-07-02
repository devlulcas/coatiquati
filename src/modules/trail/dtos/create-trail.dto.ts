import { imageFileSchema } from '$lib/utils/image-file-schema';
import { z } from 'zod';

const errors = {
	invalidTitle: 'o título deve ter no mínimo 15 caracteres',
	invalidDescription: 'a descrição é obrigatória',
	invalidThumbnailAlt: 'o texto alternativo da imagem é obrigatório'
};

export const createTrailSchema = z.object({
	title: z.string({ required_error: errors.invalidTitle }).min(15),
	description: z.string({ required_error: errors.invalidDescription }),
	thumbnail: imageFileSchema,
	thumbnailAlt: z.string({ required_error: errors.invalidThumbnailAlt })
});

export type CreateTrailDTO = z.infer<typeof createTrailSchema> & {
	authorId: string;
};
