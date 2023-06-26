import { z } from 'zod';

const MAX_IMAGE_SIZE = 1024 * 1024 * 5; // 5MB
const SUPPORTED_IMAGE_FORMATS = ['image/jpg', 'image/jpeg', 'image/png', 'image/webp'];

export const createTrailSchema = z.object({
	title: z.string({ required_error: 'o título é obrigatório' }),
	description: z.string({ required_error: 'a descrição é obrigatório' }),
	image: z
		.any()
		.refine((file) => {
			console.log(file);
			return true;
		})
		.refine(
			(file) => {
				console.log(file);
				console.log('sddsfdsf >>>', file?.size <= MAX_IMAGE_SIZE);
				return file?.size <= MAX_IMAGE_SIZE;
			},
			{
				message: 'a imagem deve ter no máximo 5MB'
			}
		)
		.refine((file) => SUPPORTED_IMAGE_FORMATS.includes(file?.type), {
			message: 'a imagem deve ser JPG, JPEG ou PNG'
		}),
	imageAlt: z.string({ required_error: 'o texto alternativo da imagem é obrigatório' })
});

export type CreateTrailDTO = z.infer<typeof createTrailSchema>;
