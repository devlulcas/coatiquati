import { z } from 'zod';

const contentTypes = ['text', 'image', 'video', 'code', 'quote', 'link'] as const;

export type ContentType = (typeof contentTypes)[number];

type InferredBreadcrumb = z.infer<typeof breadcrumbSchema>;

export type Breadcrumb = Omit<InferredBreadcrumb, 'availableContent'> & {
	availableContent: ContentType[];
};

export const breadcrumbSchema = z.object({
	id: z.number(),
	title: z.string(),
	slug: z.string(),
	description: z.string(),
	availableContent: z.array(
		z.string().refine((v) => {
			return contentTypes.includes(v as ContentType);
		})
	)
});
