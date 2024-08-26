import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

const zBoolean = z.union([z.literal('true'), z.literal('false')]);

export const env = createEnv({
  server: {
    MAINTENANCE_MODE: zBoolean,
    DATABASE_URL: z.string().min(1),
    DATABASE_AUTH_TOKEN: z.string().min(1),
    UPLOADTHING_SECRET: z.string().min(1),
    UPLOADTHING_APP_ID: z.string().min(1),
    MAIL_FROM: z.string().min(1),
    MAIL_ENV: z.string().min(1),
    DEV_MAIL_HOST: z.string().min(1),
    DEV_MAIL_SECURE: zBoolean,
    DEV_MAIL_PORT: z.string().min(1),
    DEV_MAIL_USER: z.string().min(1),
    DEV_MAIL_PASS: z.string().min(1),
    AWS_REGION: z.string().min(1),
    AWS_ACCESS_KEY: z.string().min(1),
    AWS_SECRET_ACCESS_KEY: z.string().min(1),
    S3_BUCKET: z.string().min(1),
  },
  client: {
    NEXT_PUBLIC_WEBSITE: z.string().min(1),
  },
  runtimeEnv: {
    NEXT_PUBLIC_WEBSITE: process.env.NEXT_PUBLIC_WEBSITE,
    MAINTENANCE_MODE: process.env.MAINTENANCE_MODE,
    DATABASE_URL: process.env.DATABASE_URL,
    DATABASE_AUTH_TOKEN: process.env.DATABASE_AUTH_TOKEN,
    UPLOADTHING_SECRET: process.env.UPLOADTHING_SECRET,
    UPLOADTHING_APP_ID: process.env.UPLOADTHING_APP_ID,
    MAIL_FROM: process.env.MAIL_FROM,
    MAIL_ENV: process.env.MAIL_ENV,
    DEV_MAIL_HOST: process.env.DEV_MAIL_HOST,
    DEV_MAIL_SECURE: process.env.DEV_MAIL_SECURE,
    DEV_MAIL_PORT: process.env.DEV_MAIL_PORT,
    DEV_MAIL_USER: process.env.DEV_MAIL_USER,
    DEV_MAIL_PASS: process.env.DEV_MAIL_PASS,
    AWS_REGION: process.env.AWS_REGION,
    AWS_ACCESS_KEY: process.env.AWS_ACCESS_KEY,
    AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
    S3_BUCKET: process.env.S3_BUCKET,
  },
});
