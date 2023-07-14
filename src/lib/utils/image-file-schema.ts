import { z } from 'zod';

const MAX_IMAGE_SIZE = 1024 * 1024 * 5; // 5MB
const SUPPORTED_IMAGE_FORMATS = ['image/jpg', 'image/jpeg', 'image/png', 'image/webp'];

const errors = {
	image: {
		required: 'a imagem é obrigatória',
		invalidFormat: 'a imagem deve ser ' + SUPPORTED_IMAGE_FORMATS.join(', ').replace('image/', 'do tipo '),
		invalidSize: 'a imagem deve ter no máximo 5MB'
	}
};

export const imageFileSchema = z
	.instanceof(File, { message: errors.image.required })
	.refine((file) => file !== undefined, { message: errors.image.required })
	.refine((file) => file.size > 0, { message: errors.image.required })
	.refine((file) => SUPPORTED_IMAGE_FORMATS.includes(file.type), { message: errors.image.invalidFormat })
	.refine((file) => file.size <= MAX_IMAGE_SIZE, { message: errors.image.invalidSize });

export type ImageFile = z.infer<typeof imageFileSchema>;
