import { imageFileSchema } from '$lib/utils/image-file-schema';
import { z } from 'zod';

const errors = {
	invalidTitle: 'o título deve ter no mínimo 15 caracteres',
	invalidDescription: 'a descrição é obrigatória',
	invalidImageAlt: 'o texto alternativo da imagem é obrigatório'
};

export const createTrailSchema = z.object({
	title: z.string({ required_error: errors.invalidTitle }).min(15),
	description: z.string({ required_error: errors.invalidDescription }),
	image: imageFileSchema,
	imageAlt: z.string({ required_error: errors.invalidImageAlt })
});

export type CreateTrailDTO = z.infer<typeof createTrailSchema> & {
	authorId: string;
};
