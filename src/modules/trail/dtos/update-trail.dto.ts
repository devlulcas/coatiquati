import { z } from 'zod';

const errors = {
	title: { min: 'o título deve ter no mínimo 15 caracteres' },
	description: { invalidType: 'a descrição deve ser um texto' }
};

export const updateTrailSchema = z.object({
  id: z.string(),
	title: z.string().min(15, { message: errors.title.min }).optional(),
	description: z.string({ invalid_type_error: errors.description.invalidType }).optional()
});

export type UpdateTrailSchema = z.infer<typeof updateTrailSchema>;
