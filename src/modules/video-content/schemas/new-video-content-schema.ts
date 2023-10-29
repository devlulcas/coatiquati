import { newContentSchema } from '@/modules/content/schemas/new-content-schema';
import { z } from 'zod';

export const newVideoContentSchema = newContentSchema.merge(
  z.object({
    src: z
      .string()
      .url()
      .refine(url => {
        try {
          const urlObject = new URL(url);

          const validHostnames = ['www.youtube.com', 'youtube.com', 'youtu.be'];

          return validHostnames.includes(urlObject.hostname);
        } catch (error) {
          return false;
        }
      }),
    alt: z.string(),
    description: z.string(),
  }),
);

export type NewVideoContentSchema = z.infer<typeof newVideoContentSchema>;
