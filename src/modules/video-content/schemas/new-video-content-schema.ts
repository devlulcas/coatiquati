import { upsertBaseContentSchema } from '@/modules/content/schemas/base-content';
import { z } from 'zod';

export const VALID_VIDEO_HOSTNAMES = [
  'www.youtube.com',
  'youtube.com',
  'youtu.be',
];

const videoUrlSchema = z.url().refine((url) => {
  if (!URL.canParse(url)) {
    return false;
  }

  const urlObject = new URL(url);

  return VALID_VIDEO_HOSTNAMES.includes(urlObject.hostname);
});

export const newVideoContentSchema = z
  .object({ src: videoUrlSchema })
  .extend(upsertBaseContentSchema.shape);

export type NewVideoContentSchema = z.infer<typeof newVideoContentSchema>;
