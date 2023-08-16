import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const env = createEnv({
  server: {
    DATABASE_URL: z.string(),
  },
  client: {
    NEXT_PUBLIC_WEBSITE: z.string().min(1),
  },
  runtimeEnv: {
    DATABASE_URL: process.env.DATABASE_URL,
    NEXT_PUBLIC_WEBSITE: process.env.NEXT_PUBLIC_WEBSITE,
  },
});
