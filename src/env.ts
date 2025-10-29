import { config } from 'dotenv';

config({ path: '.env.local' });

import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

const zBoolean = z.union([z.literal('true'), z.literal('false')]);

export const env = createEnv({
  server: {
    MAINTENANCE_MODE: zBoolean,
    DATABASE_URL: z.string().min(1),
    MAIL_FROM: z.string().min(1),
    MAIL_HOST: z.string().min(1),
    MAIL_PORT: z.string().min(1),
    MAIL_USER: z.string().min(1),
    MAIL_PASS: z.string().min(1),
    IMAGES_BASE_URL: z.string().min(1),
    AWS_REGION: z.string().min(1),
    AWS_ACCESS_KEY: z.string().min(1),
    AWS_SECRET_ACCESS_KEY: z.string().min(1),
    BUCKET: z.string().min(1),
  },
  client: {
    NEXT_PUBLIC_WEBSITE: z.string().min(1),
  },
  runtimeEnv: {
    NEXT_PUBLIC_WEBSITE: process.env.NEXT_PUBLIC_WEBSITE,
    MAINTENANCE_MODE: process.env.MAINTENANCE_MODE,
    DATABASE_URL: process.env.DATABASE_URL,
    MAIL_FROM: process.env.MAIL_FROM,
    MAIL_HOST: process.env.MAIL_HOST,
    MAIL_PORT: process.env.MAIL_PORT,
    MAIL_USER: process.env.MAIL_USER,
    MAIL_PASS: process.env.MAIL_PASS,
    IMAGES_BASE_URL: process.env.IMAGES_BASE_URL,
    AWS_REGION: process.env.AWS_REGION,
    AWS_ACCESS_KEY: process.env.AWS_ACCESS_KEY,
    AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
    BUCKET: process.env.BUCKET,
  },
});
