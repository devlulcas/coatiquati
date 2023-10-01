import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const env = createEnv({
  server: {
    DATABASE_URL: z.string(),
    NODE_ENV: z.string().min(1),
  },
  client: {
    NEXT_PUBLIC_WEBSITE: z.string().min(1),
  },
  runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV,
    DATABASE_URL: process.env.DATABASE_URL,
    NEXT_PUBLIC_WEBSITE: process.env.NEXT_PUBLIC_WEBSITE,
  },
});
