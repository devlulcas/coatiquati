import { z } from 'zod';

const MAX_IMAGE_SIZE = 1024 * 1024 * 5; // 5MB
const SUPPORTED_IMAGE_FORMATS = ['image/jpg', 'image/jpeg', 'image/png', 'image/webp'];

const errors = {
	invalideImageFile: 'a imagem é obrigatória',
	invalidImageFormat: 'a imagem deve ser JPG, JPEG, PNG ou WEBP',
	invalidImageSize: 'a imagem deve ter no máximo 5MB'
};

export const imageFileSchema = z
	.instanceof(File, { message: errors.invalideImageFile })
	.refine((file) => file !== undefined, { message: errors.invalideImageFile })
	.refine((file) => file.size > 0, { message: errors.invalideImageFile })
	.refine((file) => SUPPORTED_IMAGE_FORMATS.includes(file.type), { message: errors.invalidImageFormat })
	.refine((file) => file.size <= MAX_IMAGE_SIZE, { message: errors.invalidImageSize });

export type ImageFile = z.infer<typeof imageFileSchema>;
