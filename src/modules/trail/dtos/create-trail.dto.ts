import { z } from 'zod';
import { zfd } from 'zod-form-data';

const MAX_IMAGE_SIZE = 1024 * 1024 * 5; // 5MB
const SUPPORTED_IMAGE_FORMATS = ['image/jpg', 'image/jpeg', 'image/png', 'image/webp'];

const errors = {
	invalideImageFile: 'a imagem é obrigatória',
	invalidImageFormat: 'a imagem deve ser JPG, JPEG, PNG ou WEBP',
	invalidImageSize: 'a imagem deve ter no máximo 5MB',
	invalidTitle: 'o título deve ter no mínimo 15 caracteres',
	invalidDescription: 'a descrição é obrigatória',
	invalidImageAlt: 'o texto alternativo da imagem é obrigatório'
};

export const createTrailSchema = z.object({
	title: zfd.text(
		z.string({
			required_error: errors.invalidTitle
		})
	),
	description: zfd.text(
		z.string({
			required_error: errors.invalidDescription
		})
	),
	image: zfd
		.file(z.instanceof(File, { message: errors.invalideImageFile }))
		.refine((file) => SUPPORTED_IMAGE_FORMATS.includes(file.type), {
			message: errors.invalidImageFormat
		})
		.refine((file) => file.size <= MAX_IMAGE_SIZE, { message: errors.invalidImageSize }),
	imageAlt: zfd.text(
		z.string({
			required_error: errors.invalidImageAlt
		})
	)
});

export type CreateTrailDTO = z.infer<typeof createTrailSchema>;
