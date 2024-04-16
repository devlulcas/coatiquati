import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const env = createEnv({
  server: {
    DATABASE_URL: z.string(),
    NODE_ENV: z.string().min(1),
    UPLOADTHING_SECRET: z.string().min(1),
    UPLOADTHING_APP_ID: z.string().min(1),
    DEV_MAIL_HOST: z.string().min(1),
    DEV_MAIL_PORT: z.string(),
    DEV_MAIL_USER: z.string().min(1),
    DEV_MAIL_PASS: z.string().min(1),
    MAIL_MAILGUN_API_KEY: z.string().min(1),
    MAIL_FROM: z.string().min(1),
    DATABASE_AUTH_TOKEN: z.string().min(1),
  },
  client: {
    NEXT_PUBLIC_WEBSITE: z.string().min(1),
  },
  runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV,
    DATABASE_URL: process.env.DATABASE_URL,
    NEXT_PUBLIC_WEBSITE: process.env.NEXT_PUBLIC_WEBSITE,
    UPLOADTHING_SECRET: process.env.UPLOADTHING_SECRET,
    UPLOADTHING_APP_ID: process.env.UPLOADTHING_APP_ID,
    DEV_MAIL_HOST: process.env.DEV_MAIL_HOST,
    DEV_MAIL_PORT: process.env.DEV_MAIL_PORT,
    DEV_MAIL_USER: process.env.DEV_MAIL_USER,
    DEV_MAIL_PASS: process.env.DEV_MAIL_PASS,
    MAIL_MAILGUN_API_KEY: process.env.MAIL_MAILGUN_API_KEY,
    MAIL_FROM: process.env.MAIL_FROM,
    DATABASE_AUTH_TOKEN: process.env.DATABASE_AUTH_TOKEN,
  },
});
