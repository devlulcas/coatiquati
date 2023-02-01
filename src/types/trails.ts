import { z } from 'zod';

export const TrailSchema = z.object({
	id: z.number(),
	title: z.string(),
	description: z.string(),
	image: z.object({
		src: z.string(),
		alt: z.string(),
		blurDataURL: z.string(),
		width: z.number(),
		height: z.number()
	}),
	slug: z.string(),
	author: z.string(),
	breadcrumbs: z.number()
});

export type Trail = z.infer<typeof TrailSchema>;
